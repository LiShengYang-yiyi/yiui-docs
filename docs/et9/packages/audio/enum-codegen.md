---
title: 配置枚举自动生成
et9: true
---

# 配置枚举自动生成

## 在Audio 配置表中配置数据

Groupid = 枚举值

备注 = 特性标记 不建议太长且不要有回车

![](/images/et9/img/HuyPbCeKpo7zvVxB6FrcgxLvnlf.png)

## Emums

枚举值这里会自动关联到 audio表

使用表格特性自动同步 则这边表就不需要维护了

已知问题:

预留自动生成长度 不要太长  会影响导出效率

这里的IF  可能会出现绝对位置出错的问题 需要本地调整

或者使用VBA 每次改完就点一下 也不是很难

[WPS启用VBA](/et9/faq/wps-vba)

![](/images/et9/img/F9VpbARuooZtFIxA7nZcufHSnxb.png)

## 自动生成的枚举

建议修改枚举模版

在上面添加 [LabelText("")]

![](/images/et9/img/Y2t2bejZqoWGwOx6tjecH7DKn9b.png)

## VBA

[WPS启用VBA](/et9/faq/wps-vba)

```SQL
Sub Sync_To_Enums()
    Dim srcWs As Worksheet
    Dim tgtWb As Workbook
    Dim tgtWs As Worksheet
    Dim enumPath As String
    Dim lastRow As Long, i As Long

    Set srcWs = ThisWorkbook.ActiveSheet

    enumPath = ThisWorkbook.Path & "\..\Base\__enums__.xlsx"

    Application.ScreenUpdating = False

    enumPath = ThisWorkbook.Path & "\..\Base\__enums__.xlsx"
    enumPath = CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(enumPath)

    Dim bFound As Boolean
    bFound = False
    For Each tgtWb In Workbooks
        If StrComp(tgtWb.FullName, enumPath, vbTextCompare) = 0 Then
            bFound = True
            Exit For
        End If
    Next tgtWb

    If Not bFound Then
        On Error Resume Next
        Set tgtWb = Workbooks.Open(enumPath, ReadOnly:=False)
        On Error GoTo 0
    End If

    If Not bFound And tgtWb Is Nothing Then
        MsgBox "找不到 __enums__.xlsx，请确认路径正确！注意同名只能存在一个如果有其他enums表打开着请关闭后重试! ", vbExclamation
        Exit Sub
    End If

    If tgtWb Is Nothing Then
        MsgBox "找不到 __enums__.xlsx，请确认相对路径正确！", vbExclamation
        Exit Sub
    End If

    Set tgtWs = tgtWb.Worksheets(1)

    tgtWs.Range("H5:J9999").ClearContents

    lastRow = srcWs.Cells(srcWs.Rows.Count, "B").End(xlUp).Row
    If lastRow < 5 Then
        MsgBox "Condition 表 B 列从第 5 行开始没有数据！", vbInformation
        GoTo CleanExit
    End If

    Dim tgtRow As Long
    tgtRow = 5

    For i = 5 To lastRow
        If srcWs.Cells(i, "B").Value <> "" Then
            tgtWs.Cells(tgtRow, "H").Value = srcWs.Cells(i, "B").Value
            tgtWs.Cells(tgtRow, "I").Value = srcWs.Cells(i, "C").Value
            tgtRow = tgtRow + 1
        End If
    Next i

    tgtWb.Save

    MsgBox "同步完成！共写入 " & (tgtRow - 5) & " 行。", vbInformation

CleanExit:
    Application.ScreenUpdating = True
End Sub

```

## VBA 同步演示

至于是点击宏执行 还是加个框体点一下执行都可以 看习惯 本质是一样的

想要的结果就是修改完后点一下同步

![](/images/et9/img/VObkbmOEBovUt4xYKfLc45OLnWh.png)
