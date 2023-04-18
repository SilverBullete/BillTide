import json

from time import sleep
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.utils import timezone

from .response import APIResult, APIServerError
from .models import User, Book, Record, Category, Note
from .email import get_latest_email

category_dic = {'other': 0,
                'expense': 1,
                'income': 2,
                'none': 3
                }


@csrf_exempt
# 根据用户id获取所有账本
def get_books(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    books = Book.get_books_by_user(user_id)
    return APIResult(books)


@csrf_exempt
# 根据账本id获取账本信息
def get_book_by_id(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    book_id = request_post['book_id']
    books = Book.objects.filter(id=book_id)
    if len(books) == 0:
        return APIServerError("没找到该账本")
    book = books.first().get_book_json()
    book['owner'] = book['creator'] == user_id
    return APIResult(book)


@csrf_exempt
# 更新账本名称
def update_book_title(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    book_id = request_post['book_id']
    title = request_post['title']
    books = Book.objects.filter(id=book_id)
    if len(books) == 0:
        return APIServerError("没找到该账本")
    book = books.first()
    book.name = title
    book.save()
    return APIResult(book.get_book_json())


@csrf_exempt
# 更新账本伙伴
def update_book_partner(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    book_id = request_post['book_id']
    partner = request_post['partner']
    books = Book.objects.filter(id=book_id)
    if len(books) == 0:
        return APIServerError("没找到该账本")
    book = books.first()
    book.partner = User.objects.get(id=partner)
    book.save()
    return APIResult(book.get_book_json())


@csrf_exempt
# 根据账本id获取记录
def get_records_by_book(request):
    request_post = json.loads(request.body)
    book_id = request_post['book_id']
    filter_id = request_post['filter_id']
    books = Book.objects.filter(id=book_id)
    if len(books) > 0:
        return APIResult(books.first().get_book_records(filter_id))
    else:
        return APIServerError('账本ID不存在')


@csrf_exempt
# 根据账本id和月份获取记录
def get_records_by_month(request):
    request_post = json.loads(request.body)
    book_id = request_post['book_id']
    month = request_post['month']
    books = Book.objects.filter(id=book_id)
    if len(books) > 0:
        first_month = books.first().book_record.order_by('date').first().date
        return APIResult({"records": books.first().get_month_records(month), "first_month": first_month})
    else:
        return APIServerError('账本ID不存在')


@csrf_exempt
# 根据账本id和月份获取收支统计信息
def get_recent_records_count(request):
    request_post = json.loads(request.body)
    book_id = request_post['book_id']
    month = request_post['month']
    year = int(month.split('-')[0])
    month = int(month.split('-')[1])
    res = []
    books = Book.objects.filter(id=book_id)
    book = None
    if len(books) > 0:
        book = books.first()
    else:
        return APIServerError('账本ID不存在')
    for i in range(6):
        if month == 0:
            year -= 1
            month = 12
        records = book.get_month_records('{}-{:0>2d}'.format(year, month))
        res.append({
            'month': records['month'],
            'incomeTotal': records['incomeTotal'],
            'expenseTotal': records['expenseTotal']
        })
        month -= 1
    return APIResult(res)


@csrf_exempt
# 添加账本
def add_book(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    cover = request_post['cover']
    name = request_post['name']
    partner = request_post['partner']
    book = None
    if len(Book.objects.filter(name=name, creator=User.objects.get(id=user_id))) > 0 or len(Book.objects.filter(name=name, partner=User.objects.get(id=user_id))) > 0:
        return APIServerError('账本名称已存在')
    try:
        if partner != '':
            book = Book.objects.create(cover=cover, name=name,
                                       creator=User.objects.get(id=user_id), partner=User.objects.get(id=partner))
        else:
            book = Book.objects.create(cover=cover, name=name,
                                       creator=User.objects.get(id=user_id))
        return APIResult('')
    except Exception as e:
        print(e)
        return APIServerError('创建账本失败')


@csrf_exempt
# 添加记录
def add_record(request):
    try:
        request_post = json.loads(request.body)
        creator = User.objects.filter(id=request_post['user_id']).first()
        date = request_post['date']
        category = Category.objects.filter(
            id=request_post['category_id']).first()
        amount = float(request_post['amount'])
        note = request_post['note']
        record_type = category_dic[request_post['record_type']]
        book = Book.objects.filter(id=request_post['book_id']).first()
        record = Record.objects.create(date=date, category=category, amount=amount,
                                       note=note, record_type=record_type, book=book, creator=creator)
        return APIResult('')
    except Exception as e:
        print(e)
        return APIServerError('创建记录失败')


@csrf_exempt
# 编辑记录
def edit_record(request):
    try:
        request_post = json.loads(request.body)
        creator = User.objects.filter(id=request_post['user_id']).first()
        record_id = request_post['id']
        date = request_post['date']
        category = Category.objects.filter(
            id=request_post['category_id']).first()
        amount = float(request_post['amount'])
        note = request_post['note']
        record_type = category_dic[request_post['record_type']]
        record = Record.objects.get(id=record_id)
        record.date = date
        record.category = category
        record.amount = amount
        record.note = note
        record.record_type = record_type
        record.save()
        return APIResult('修改成功')
    except Exception as e:
        print(e)
        return APIServerError('修改记录失败')


@csrf_exempt
# 删除记录失败
def delete_record_by_id(request):
    try:
        request_post = json.loads(request.body)
        # creator = User.objects.filter(id=request_post['user_id']).first()
        record_id = request_post['record_id']
        record = Record.objects.get(id=record_id)
        record.delete()
        return APIResult('删除成功')
    except Exception as e:
        print(e)
        return APIServerError('删除记录失败')


@csrf_exempt
# 删除账本
def delete_book_by_id(request):
    try:
        request_post = json.loads(request.body)
        # creator = User.objects.filter(id=request_post['user_id']).first()
        book_id = request_post['book_id']
        book = Book.objects.get(id=book_id)
        book.delete()
        return APIResult('删除成功')
    except Exception as e:
        print(e)
        return APIServerError('删除账本失败')


@csrf_exempt
# 判断用户是否存在
def check_user_exist(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    user = User.objects.filter(id=user_id)
    return APIResult(len(user) > 0)


@csrf_exempt
# 根据用户id获取记录类型
def get_categories(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    category_type = request_post['category_type']
    categories = Category.objects.filter(
        Q(category_type=category_dic[category_type]) & (Q(owner='') | Q(owner=user_id))).order_by('owner')
    res = []
    for category in categories:
        res.append(category.get_category_json())
    return APIResult(res)


@csrf_exempt
def get_all_categories(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    categories = Category.objects.filter(
        Q(owner='') | Q(owner=user_id)).order_by('owner')
    res = []
    for category in categories:
        res.append(category.get_category_json())
    return APIResult(res)


@csrf_exempt
def get_notes(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    user = User.objects.filter(id=user_id)
    if len(user) == 0:
        return APIServerError("未找到用户")
    user = user.first()
    notes = user.creator_note.all().order_by('-used_time')
    res = []
    for note in notes[:5]:
        res.append(note.get_note_json())
    return APIResult(res)


@csrf_exempt
def get_record_by_id(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    user = User.objects.filter(id=user_id)
    if len(user) == 0:
        return APIServerError("未找到用户")
    user = user.first()
    record_id = request_post['record_id']
    record = Record.objects.filter(id=int(record_id))
    if len(record) == 0:
        return APIServerError("未找到条目")
    record = record.first()
    return APIResult(record.get_record_json())


@csrf_exempt
def add_note(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    content = request_post['content']
    user = User.objects.filter(id=user_id)
    if len(user) == 0:
        return APIServerError("未找到用户")
    user = user.first()
    note = Note.objects.filter(creator=user, content=content)
    if len(note) == 0:
        Note.objects.create(content=content, creator=user)
        return APIResult("创建成功")
    note = note.first()
    note.content = content
    # note.used_time = timezone.now
    note.save()
    return APIResult("修改成功")


@csrf_exempt
def get_records_from_app(request):
    request_post = json.loads(request.body)
    user_id = request_post['user_id']
    sender = request_post['sender']
    extracting_passwords = request_post['extracting_passwords']
    count = 0
    while count < 11:
        result = get_latest_email(user_id, sender, extracting_passwords)
        if result['code'] == 200:
            # todo
            return APIResult("导入成功")
        elif result['code'] == 501:
            return APIServerError(result['message'])
        elif result['code'] == 201:
            if count == 10:
                return APIServerError(result['message'])
        count += 1
        sleep(5)
    return APIServerError('未获取到指定的邮件')


def init_icons(request):
    icons = [
        {"name": "餐饮", "icon_name": "icon-canyin", "category_type": "expense"},
        {"name": "交通", "icon_name": "icon-jiaotong", "category_type": "expense"},
        {"name": "服饰", "icon_name": "icon-yiwu", "category_type": "expense"},
        {"name": "购物", "icon_name": "icon-gouwuche", "category_type": "expense"},
        {"name": "买菜", "icon_name": "icon-maicai", "category_type": "expense"},
        {"name": "教育", "icon_name": "icon-jiaoyu", "category_type": "expense"},
        {"name": "娱乐", "icon_name": "icon-yule", "category_type": "expense"},
        {"name": "运动", "icon_name": "icon-yundong", "category_type": "expense"},
        {"name": "生活缴费", "icon_name": "icon-fangzu", "category_type": "expense"},
        {"name": "旅行", "icon_name": "icon-lvyoudujia", "category_type": "expense"},
        {"name": "宠物", "icon_name": "icon-chongwu", "category_type": "expense"},
        {"name": "医疗", "icon_name": "icon-yaopin", "category_type": "expense"},
        {"name": "日用品", "icon_name": "icon-riyongpin", "category_type": "expense"},
        {"name": "发红包", "icon_name": "icon-hongbao", "category_type": "expense"},
        {"name": "修理", "icon_name": "icon-xiuliweihu", "category_type": "expense"},
        {"name": "其他", "icon_name": "icon-CombinedShape", "category_type": "expense"},
        {"name": "编辑", "icon_name": "icon-bianji", "category_type": "expense"},

        {"name": "工资", "icon_name": "icon-yinhangqia", "category_type": "income"},
        {"name": "收红包", "icon_name": "icon-hongbao", "category_type": "income"},
        {"name": "其他", "icon_name": "icon-CombinedShape", "category_type": "income"},
        {"name": "编辑", "icon_name": "icon-bianji", "category_type": "income"},

        {"name": "理财", "icon_name": "icon-touzizhongxin", "category_type": "other"},
        {"name": "接还款", "icon_name": "icon-xinyongqia", "category_type": "other"},
        {"name": "其他", "icon_name": "icon-CombinedShape", "category_type": "other"},
        {"name": "编辑", "icon_name": "icon-bianji", "category_type": "other"},

        {"name": "饮品", "icon_name": "icon-yinpin", "category_type": "none"},
        {"name": "化妆品", "icon_name": "icon-huazhuangpin", "category_type": "none"},
        {"name": "电影", "icon_name": "icon-dianying", "category_type": "none"},
        {"name": "淘宝", "icon_name": "icon-taobao", "category_type": "none"},
        {"name": "蚂蚁花呗", "icon_name": "icon-mayihuabei", "category_type": "none"},
        {"name": "京东白条", "icon_name": "icon-jingdongbaitiao", "category_type": "none"},
        {"name": "水果", "icon_name": "icon-shuiguo", "category_type": "none"},
        {"name": "礼物", "icon_name": "icon-liwu", "category_type": "none"},
        {"name": "游戏", "icon_name": "icon-youxi", "category_type": "none"},
        {"name": "书籍教材", "icon_name": "icon-shujijiaocai", "category_type": "none"},
        {"name": "汽车用品", "icon_name": "icon-qicheyongpin", "category_type": "none"},
        {"name": "家具", "icon_name": "icon-jiaju", "category_type": "none"},
        {"name": "家电", "icon_name": "icon-jiadian", "category_type": "none"},
        {"name": "婚姻恋爱", "icon_name": "icon-hunyinlianai", "category_type": "none"},
        {"name": "音乐娱乐", "icon_name": "icon-yinleyule", "category_type": "none"},
        {"name": "数码产品", "icon_name": "icon-shumachanpin", "category_type": "none"},
        {"name": "育儿", "icon_name": "icon-yuer", "category_type": "none"},
        {"name": "零食", "icon_name": "icon-lingshi", "category_type": "none"},
        {"name": "一般", "icon_name": "icon-yiban", "category_type": "none"},
        {"name": "借入", "icon_name": "icon-jieru", "category_type": "none"},
        {"name": "借出", "icon_name": "icon-jiechu", "category_type": "none"},
        {"name": "储值卡", "icon_name": "icon-chuzhiqia", "category_type": "none"}
    ]

    category_dic = {'other': 0,
                    'expense': 1,
                    'income': 2,
                    'none': 3
                    }
    for icon in icons:
        Category.objects.create(
            name=icon['name'], icon_name=icon['icon_name'], category_type=category_dic[icon['category_type']])
    return APIResult("success")
