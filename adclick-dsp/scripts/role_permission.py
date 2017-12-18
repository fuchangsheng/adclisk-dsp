# -*- coding: utf-8 -*-
import xlrd, json, codecs, copy

def read_excel(filename, sheetname):
    workbook = xlrd.open_workbook(filename)
    sheet = workbook.sheet_by_name(sheetname)
    categories = sheet.col_values(1)
    subcategories = sheet.col_values(2)
    roles = sheet.row_values(1)
    permissions = sheet.row_values(2)
    col_len = len(categories)
    row_len = len(roles)
    role_permissions = []
    for i in range(row_len):
        if roles[i]:
            row_start = i
            break
    trigger = False
    for i in range(col_len):
        print subcategories[i]
        if not subcategories[i]:
            if trigger:
                break
            else:
                continue
        trigger = True
        if categories[i]:
            category_data = {}
            subcategory_datas = []            
            category = categories[i]
        subcategory = subcategories[i]
        category_data["name"] = category
        subcategory_data = {}
        subcategory_data["name"] = subcategory
        permission_datas = []
        for j in range(row_start, row_len):
            permission_data = {}
            if not roles[j]:
                continue
            role_name = roles[j]
            permission_data["role"] = role_name
            permission_data["readable"] = sheet.cell(i, j).value if sheet.cell(i, j).value else 'NONE'
            permission_data["writable"] = sheet.cell(i, j+1).value if sheet.cell(i, j+1).value else'NONE'
            permission_datas.append(permission_data)
        subcategory_data["datas"] = permission_datas
        subcategory_datas.append(subcategory_data)
        category_data["subcategories"] = subcategory_datas
        if categories[i]:
            role_permissions.append(category_data)
    with open("../business_system/conf/role_permission.json", "w") as f:
        json.dump(role_permissions, f)


def read_excel_ex(filename, sheetname):
    workbook = xlrd.open_workbook(filename)
    sheet = workbook.sheet_by_name(sheetname)
    categories = sheet.col_values(1)
    subcategories = sheet.col_values(2)
    roles = sheet.row_values(1)
    col_len = len(categories)
    row_len = len(roles)
    role_permissions = []
    for i in range(row_len):
        if roles[i]:
            row_start = i
            break
    permissions = []
    #role
    for i in range(row_start, row_len):
        if not roles[i]:
            continue
        role_name = roles[i]
        category_datas = []
        permission = {}
        permission["role"] = role_name
        permission["categories"] = category_datas
        print role_name
        if role_name == u"管理员":
            permission_createor = {}
            permission_createor["role"] = u"主账户"
            permission_createor["categories"] = category_datas
            permissions.append(permission_createor)
        permissions.append(permission)
        #permission
        trigger = False
        for j in range(col_len):
            print subcategories[j]
            if not subcategories[j]:
                if trigger:
                    break
                else:
                    continue
            trigger = True
            #category
            if categories[j]:
                category_item = {}                
                category_data = {}
                subcategory_datas = []
                category = categories[j]
                category_data["name"] = category
                category_data["subcategories"] = subcategory_datas
                category_item["category"] = category_data
                category_datas.append(category_data)
            #subcategory
            subcategory = subcategories[j]            
            subcategory_data = {}
            subcategory_data["name"] = subcategory
            subcategory_data["readable"] = sheet.cell(j, i).value if sheet.cell(j, i).value else 'NONE'
            subcategory_data["writable"] = sheet.cell(j, i+1).value if sheet.cell(j, i+1).value else'NONE'
            subcategory_datas.append(subcategory_data)
    with open("../business_system/conf/role_permission.json", "w") as f:
        json.dump(permissions, f)

    
if __name__ == "__main__":
    #read_excel("C:/Users/dmtec/Documents/dspv3.0/AdClick DSP V3.0 权限管理.xlsx", "Sheet1")
    read_excel_ex("role_permissions.xlsx", "Sheet1")