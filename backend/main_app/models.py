from django.db import models
from django.utils import timezone
from django.db.models import Q
import copy


RECORD_TYPE = (
    (0, 'other'),  # '不计入收支'
    (1, 'expense'),  # '支出'
    (2, 'income'),  # '入账'
    (3, 'none')
)

GENDER = (
    (0, '女'),
    (1, '男')
)

APP_TYPE = (
    (0, 'alipay'),
    (1, 'wechat')
)


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=11,
                          verbose_name="用户手机号")
    password = models.CharField(max_length=200, verbose_name="用户密码")
    gender = models.IntegerField(choices=GENDER, verbose_name="用户性别")
    username = models.CharField(max_length=20, verbose_name="用户名")


class Book(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=16, verbose_name="账本名称")
    cover = models.IntegerField(verbose_name="账本封面")
    creator = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='creator_book', verbose_name="账本创建者")
    partner = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='partner_book', null=True, blank=True, verbose_name="账本参与者")
    created_time = models.DateTimeField(
        default=timezone.now, verbose_name="账本创建时间")
    updated_time = models.DateTimeField(
        auto_now=True, blank=True, verbose_name="账本更新时间")

    @staticmethod
    def get_books_by_user(user_id):
        books = Book.objects.filter(Q(creator=user_id) | Q(
            partner=user_id)).order_by('-updated_time')
        books_res = []
        for book in books:
            books_res.append({
                "id": book.id,
                "name": book.name,
                "cover": book.cover,
                "total_spend": book.get_book_total_spend(),
                "total_income": book.get_book_total_income(),
                "creator": book.creator.gender,
                "partner": book.partner.gender if book.partner else None
            })
        return books_res

    def get_book_total_spend(self):
        res = 0
        for record in self.book_record.all():
            if record.record_type == RECORD_TYPE[1][0]:
                res += record.amount
        return res

    def get_book_total_income(self):
        res = 0
        for record in self.book_record.all():
            if record.record_type == RECORD_TYPE[2][0]:
                res += record.amount
        return res

    def get_book_records(self, filter_id):
        res = []
        pre_month = ''
        pre_day = ''
        month = {
            "month": '',
            'recordList': [],
            'incomeTotal': 0,
            'expenseTotal': 0,
        }
        day = {
            'day': '',
            'recordList': [],
            'incomeTotal': 0,
            'expenseTotal': 0,
        }
        for record in self.book_record.all().order_by('-date'):
            if record.category.id != filter_id and filter_id != 0:
                continue
            if record.date[:10] != pre_day:
                if day['day'] != '':
                    month['recordList'].append(copy.deepcopy(day))
                    month['incomeTotal'] += day['incomeTotal']
                    month['expenseTotal'] += day['expenseTotal']
                day['day'] = record.date[:10]
                day['recordList'] = [record.get_record_json()]
                day['incomeTotal'] = record.amount if record.record_type == RECORD_TYPE[2][0] else 0
                day['expenseTotal'] = record.amount if record.record_type == RECORD_TYPE[1][0] else 0
            if record.date[:7] != pre_month:
                if month['month'] != '':
                    res.append(copy.deepcopy(month))
                pre_month = record.date[:7]
                month['month'] = pre_month
                month['recordList'] = []
                month['incomeTotal'] = 0
                month['expenseTotal'] = 0
            if record.date[:10] == pre_day:
                day['recordList'].append(record.get_record_json())
                day['incomeTotal'] = day['incomeTotal'] + \
                    record.amount if record.record_type == RECORD_TYPE[2][0] else 0
                day['expenseTotal'] = day['expenseTotal'] + \
                    record.amount if record.record_type == RECORD_TYPE[1][0] else 0
            pre_day = record.date[:10]

        if day['day'] != '':
            month['recordList'].append(copy.deepcopy(day))
            month['incomeTotal'] += day['incomeTotal']
            month['expenseTotal'] += day['expenseTotal']
        if month['month'] != '':
            res.append(copy.deepcopy(month))
        return res

    def get_month_records(self, month):
        pre_day = ''
        day = {
            'day': '',
            'recordList': [],
            'incomeTotal': 0,
            'expenseTotal': 0,
        }
        res = {
            'month': month,
            'recordList': [],
            'incomeTotal': 0,
            'expenseTotal': 0
        }
        for record in self.book_record.filter(date__startswith=month).order_by('-date'):
            if record.date[:10] != pre_day:
                if day['day'] != '':
                    res['recordList'].append(copy.deepcopy(day))
                    res['incomeTotal'] += day['incomeTotal']
                    res['expenseTotal'] += day['expenseTotal']
                day['day'] = record.date[:10]
                day['recordList'] = [record.get_record_json()]
                day['incomeTotal'] = record.amount if record.record_type == RECORD_TYPE[2][0] else 0
                day['expenseTotal'] = record.amount if record.record_type == RECORD_TYPE[1][0] else 0
            if record.date[:10] == pre_day:
                day['recordList'].append(record.get_record_json())
                day['incomeTotal'] = day['incomeTotal'] + \
                    record.amount if record.record_type == RECORD_TYPE[2][0] else 0
                day['expenseTotal'] = day['expenseTotal'] + \
                    record.amount if record.record_type == RECORD_TYPE[1][0] else 0
        if day['day'] != '':
            res['recordList'].append(copy.deepcopy(day))
            res['incomeTotal'] += day['incomeTotal']
            res['expenseTotal'] += day['expenseTotal']
        return res

    def get_book_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "creator": self.creator.id,
            "partner": self.partner.id if self.partner else ''
        }


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40, verbose_name="类型名称")
    icon_name = models.CharField(max_length=40, verbose_name="图标名称")
    owner = models.CharField(max_length=11, default='', verbose_name="拥有者")
    category_type = models.IntegerField(
        choices=RECORD_TYPE, verbose_name="收支类型")

    def get_category_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "iconName": self.icon_name,
            "categoryType": RECORD_TYPE[self.category_type][1],
        }


class Record(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.CharField(max_length=20, verbose_name="收支日期")
    category = models.ForeignKey(
        to=Category, related_name='category_record', on_delete=models.CASCADE, verbose_name="收支类别")
    amount = models.FloatField(verbose_name="收支数目")
    note = models.CharField(max_length=100, verbose_name="收支备注")
    record_type = models.IntegerField(choices=RECORD_TYPE, verbose_name="收支类型")
    book = models.ForeignKey(
        to=Book, related_name='book_record', on_delete=models.CASCADE)
    creator = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='creator_record', verbose_name="创建者")

    def get_record_json(self):
        return {
            'id': self.id,
            'date': self.date,
            'category': self.category.get_category_json(),
            'amount': self.amount,
            'note': self.note,
            'recordType': RECORD_TYPE[self.record_type][1],
            'creator': self.creator.username
        }


class Note(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.CharField(max_length=30, verbose_name="备注内容")
    used_time = models.DateTimeField(
        auto_now=True,  blank=True, verbose_name="备注使用时间")
    creator = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='creator_note', verbose_name="创建者")

    def get_note_json(self):
        return {
            "id": self.id,
            "content": self.content
        }


class AppRecord(models.Model):
    id = models.CharField(primary_key=True, max_length=50, verbose_name="订单号")
    date = models.CharField(max_length=20, verbose_name="收支日期")
    category = models.CharField(max_length=40, verbose_name="收支类别")
    amount = models.FloatField(verbose_name="收支数目")
    note = models.CharField(max_length=100, verbose_name="收支备注")
    record_type = models.IntegerField(choices=RECORD_TYPE, verbose_name="收支类型")
    app = models.IntegerField(choices=APP_TYPE, verbose_name="app类型")
    other_side = models.CharField(max_length=100, verbose_name="支付对方")
    status = models.CharField(max_length=50, verbose_name="订单状态")
    creator = models.ForeignKey(
        to=User, on_delete=models.CASCADE, related_name='creator_apprecord', verbose_name="创建者")
