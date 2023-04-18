import zmail
import requests
import csv
from bill_tide.settings import EMAIL, PASSWORD
from .zip import un_zip


EMAIL_SENDER = {
    "alipay": 'service@mail.alipay.com',
    "wechat": 'wechatpay@tencent.com'
}


def get_latest_email(user, sender, extracting_passwords):
    server = zmail.server(email, pas)
    mails = server.get_mails(sender=EMAIL_SENDER[sender])
    result = {
        "code": 200,
        "res": [],
        "message": ''
    }
    for mail in mails[::-1]:
        file_name = ''
        try:
            if sender == "wechat":
                # 保存文件
                content = requests.get(mails[0]['content_html'][0].split(
                    "<a href=\"")[1].split("\"")[0]).content
                file_name = "d:/zhangdan/email/wechat_file.zip"
                with open(file_name, "wb") as f:
                    f.write(content)
            else:
                # 保存文件
                for (filename, content) in mail['attachments'][:1]:
                    file_name = "d:/zhangdan/email/"+filename
                    with open(file_name, "wb") as f:
                        f.write(content)
        # 保存文件失败则跳过
        except:
            continue
        # 解压文件
        do_zip_res = un_zip(user, file_name, extracting_passwords)
        # 解压密码正确，开始读取
        if do_zip_res:
            # 读取文件
            path = ''
            res = []
            try:
                if sender == "wechat":
                    res = read_wechat_csv(path)
                else:
                    res = read_alipay_csv(path)
            except:
                result['code'] = 501
                result['message'] = sender + "账单文件格式更改,提醒管理员更新"
            # 删除该邮件
            server.delete(mail['id'])
            # 删除所有文件
            # todo
            result['res'] = res
            return result
    result['code'] = 201
    result['message'] = '未读取到邮件'
    return result


def read_wechat_csv(path):
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        start = False
        header = []
        res = []
        for row in reader:
            if not start and row[0].startswith('----'):
                start = True
                header = next(reader)
                continue
            if start:
                res.append({
                    "id": 'w' + row[8].split('\t')[0],
                    "date": row[0],
                    "amount": float(row[5][1:]),
                    "note": row[3] if row[3] != '/' else '',
                    "record_type": 1 if row[4] == "支出" else 2 if row[4] == '收入' else 0,
                    "other_side": row[2],
                    'status': row[7],
                    "category": row[1],
                    "from": "wechat"
                })
        return res


def read_alipay_csv(path):
    with open(path, 'r', encoding='gbk') as f:
        reader = csv.reader(f)
        start = False
        header = []
        res = []
        for row in reader:
            row = [i.strip() for i in row]
            if not start and row[0].startswith('----'):
                start = True
                header = next(reader)
                continue
            if start:
                if len(row) == 1:
                    break
                res.append({
                    "id": 'a' + row[8],
                    "date": row[10],
                    "amount": float(row[5][1:]),
                    "note": row[3] if row[3] != '/' else '',
                    "record_type": 1 if row[0] == "支出" else 2 if row[0] == '收入' else 0,
                    "other_side": row[1] + " | " + row[2],
                    'status': row[6],
                    "category": row[7],
                    "from": "alipay"
                })
        return res
