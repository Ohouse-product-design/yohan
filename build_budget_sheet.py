"""Build Product Design TTB budget tracking spreadsheet."""
from openpyxl import Workbook
from openpyxl.styles import (
    Alignment, Border, Font, PatternFill, Side
)
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.worksheet.datavalidation import DataValidation


# ---------- Styles ----------
THIN = Side(style="thin", color="CCCCCC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

HEADER_FILL = PatternFill("solid", fgColor="1F2937")
HEADER_FONT = Font(name="Pretendard", bold=True, color="FFFFFF", size=11)

SUBHEADER_FILL = PatternFill("solid", fgColor="F3F4F6")
SUBHEADER_FONT = Font(name="Pretendard", bold=True, color="111827", size=11)

TITLE_FONT = Font(name="Pretendard", bold=True, size=18, color="111827")
SECTION_FONT = Font(name="Pretendard", bold=True, size=13, color="111827")
NORMAL_FONT = Font(name="Pretendard", size=11, color="111827")
MUTED_FONT = Font(name="Pretendard", size=10, color="6B7280")

KEY_FILL = PatternFill("solid", fgColor="FEF3C7")  # light yellow for key numbers
INPUT_FILL = PatternFill("solid", fgColor="EFF6FF")  # light blue for editable cells

CENTER = Alignment(horizontal="center", vertical="center")
LEFT = Alignment(horizontal="left", vertical="center", indent=1)
RIGHT = Alignment(horizontal="right", vertical="center", indent=1)

KRW = '#,##0"원"'
PCT = '0.0%'
DATE = 'yyyy-mm-dd'


def style_header_row(ws, row, start_col, end_col):
    for c in range(start_col, end_col + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = CENTER
        cell.border = BORDER


def set_col_widths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w


# ---------- Build workbook ----------
wb = Workbook()

# =========================================================
# Sheet: 설정
# =========================================================
ws_cfg = wb.active
ws_cfg.title = "설정"

ws_cfg["A1"] = "예산 설정"
ws_cfg["A1"].font = TITLE_FONT
ws_cfg.row_dimensions[1].height = 30

cfg_rows = [
    ("총 예산 (Product Design)", 3699320, KRW, True),
    ("예산 시작월", "2026-01-01", DATE, True),
    ("예산 종료월", "2026-12-31", DATE, True),
    ("기준일 (오늘)", "=TODAY()", DATE, False),
    ("총 개월 수", '=DATEDIF(B3,B4,"M")+1', "0", False),
    ("경과 개월 수",
     '=MIN(DATEDIF(B3,B5,"M")+1, B6)', "0", False),
    ("남은 개월 수", "=MAX(B6-B7+1,1)", "0", False),
]

for i, (label, value, fmt, editable) in enumerate(cfg_rows, start=2):
    ws_cfg.cell(row=i, column=1, value=label).font = SUBHEADER_FONT
    ws_cfg.cell(row=i, column=1).fill = SUBHEADER_FILL
    ws_cfg.cell(row=i, column=1).alignment = LEFT
    ws_cfg.cell(row=i, column=1).border = BORDER

    c = ws_cfg.cell(row=i, column=2, value=value)
    c.font = NORMAL_FONT
    c.alignment = RIGHT
    c.number_format = fmt
    c.border = BORDER
    if editable:
        c.fill = INPUT_FILL

ws_cfg["D2"] = "💡 파란색 셀만 수정하세요. 나머지는 자동 계산됩니다."
ws_cfg["D2"].font = MUTED_FONT

set_col_widths(ws_cfg, [22, 18, 2, 60])

# Named ranges
wb.defined_names["총예산"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "총예산", attr_text="설정!$B$2"
)
wb.defined_names["기준일"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "기준일", attr_text="설정!$B$5"
)
wb.defined_names["총개월"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "총개월", attr_text="설정!$B$6"
)
wb.defined_names["경과개월"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "경과개월", attr_text="설정!$B$7"
)
wb.defined_names["남은개월"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "남은개월", attr_text="설정!$B$8"
)


# =========================================================
# Sheet: 멤버
# =========================================================
ws_mem = wb.create_sheet("멤버")

ws_mem["A1"] = "팀원 명단 & 1인 할당"
ws_mem["A1"].font = TITLE_FONT
ws_mem.row_dimensions[1].height = 30

ws_mem["A2"] = "💡 이름을 추가/수정하면 대시보드에 자동 반영됩니다. 1인 할당은 균등분배 기본값이며, 직접 수정도 가능합니다."
ws_mem["A2"].font = MUTED_FONT
ws_mem.merge_cells("A2:E2")

mem_headers = ["이름", "1인 할당 (균등)", "1인 할당 (수동, 선택)", "적용 할당", "비고"]
for i, h in enumerate(mem_headers, start=1):
    ws_mem.cell(row=4, column=i, value=h)
style_header_row(ws_mem, 4, 1, 5)
ws_mem.row_dimensions[4].height = 26

# Product Design 팀원 명단 (2026년 4월 기준)
default_members = [
    ("이요한(Yohan)", "리더"),
    ("정수현(Gongdee)", ""),
    ("문지선(Sun)", ""),
    ("윤소현(Jenna)", ""),
    ("한수민(Stella)", ""),
    ("이선진(Deeer)", ""),
    ("이재구(Jack)", ""),
    ("조수경(Skamie)", ""),
    ("방채영(Dana)", ""),
    ("윤세린(Selah)", ""),
    ("심희정(Lana)", ""),
    ("백신혜(Gina)", ""),
    ("안유진(Jinny)", ""),
]
MEM_START = 5
MEM_ROWS = 30  # capacity for up to 30 members

for i in range(MEM_ROWS):
    row = MEM_START + i
    if i < len(default_members):
        name, note = default_members[i]
    else:
        name, note = "", ""
    ws_mem.cell(row=row, column=1, value=name).fill = INPUT_FILL
    # 1인 할당 (균등) = 총예산 / 활성 멤버 수
    ws_mem.cell(
        row=row, column=2,
        value=f'=IF(A{row}="","",총예산/COUNTA($A${MEM_START}:$A${MEM_START + MEM_ROWS - 1}))'
    ).number_format = KRW
    # 수동 할당 (입력 가능)
    ws_mem.cell(row=row, column=3).fill = INPUT_FILL
    ws_mem.cell(row=row, column=3).number_format = KRW
    # 적용 할당 = 수동값이 있으면 그것, 없으면 균등
    ws_mem.cell(
        row=row, column=4,
        value=f'=IF(A{row}="","",IF(ISNUMBER(C{row}),C{row},B{row}))'
    ).number_format = KRW
    ws_mem.cell(row=row, column=5, value=note).fill = INPUT_FILL  # 비고

    for c in range(1, 6):
        cell = ws_mem.cell(row=row, column=c)
        cell.font = NORMAL_FONT
        cell.border = BORDER
        cell.alignment = LEFT if c in (1, 5) else RIGHT

set_col_widths(ws_mem, [18, 18, 20, 18, 40])

# Named range for member names list
wb.defined_names["멤버목록"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "멤버목록",
    attr_text=f"멤버!$A${MEM_START}:$A${MEM_START + MEM_ROWS - 1}"
)


# =========================================================
# Sheet: 사용내역
# =========================================================
ws_log = wb.create_sheet("사용내역")

ws_log["A1"] = "사용 내역 입력"
ws_log["A1"].font = TITLE_FONT
ws_log.row_dimensions[1].height = 30

ws_log["A2"] = (
    "💡 한 줄에 한 건씩 입력하세요. 날짜 / 이름 / 카테고리 / 사용처 / 금액(원) / 영수증 링크. "
    "이름은 드롭다운으로 멤버 시트에 등록된 사람만 선택됩니다."
)
ws_log["A2"].font = MUTED_FONT
ws_log.merge_cells("A2:F2")

log_headers = ["날짜", "이름", "카테고리", "사용처/내용", "금액(원)", "영수증 링크"]
for i, h in enumerate(log_headers, start=1):
    ws_log.cell(row=4, column=i, value=h)
style_header_row(ws_log, 4, 1, 6)
ws_log.row_dimensions[4].height = 26

LOG_START = 5
LOG_ROWS = 500  # capacity for up to 500 entries

# Sample entries to show format
samples = [
    ("2026-02-14", "정수현(Gongdee)", "도서", "디자인 시스템 책 구매", 45000, ""),
    ("2026-03-08", "문지선(Sun)", "교육", "Figma 컨퍼런스 티켓", 180000, ""),
    ("2026-03-22", "한수민(Stella)", "툴/구독", "Figma 연간 구독", 220000, ""),
]

for i in range(LOG_ROWS):
    row = LOG_START + i
    if i < len(samples):
        date, name, cat, desc, amt, link = samples[i]
        ws_log.cell(row=row, column=1, value=date).number_format = DATE
        ws_log.cell(row=row, column=2, value=name)
        ws_log.cell(row=row, column=3, value=cat)
        ws_log.cell(row=row, column=4, value=desc)
        ws_log.cell(row=row, column=5, value=amt).number_format = KRW
        ws_log.cell(row=row, column=6, value=link)
    else:
        ws_log.cell(row=row, column=1).number_format = DATE
        ws_log.cell(row=row, column=5).number_format = KRW

    for c in range(1, 7):
        cell = ws_log.cell(row=row, column=c)
        cell.font = NORMAL_FONT
        cell.border = BORDER
        cell.fill = INPUT_FILL
        if c == 5:
            cell.alignment = RIGHT
        elif c == 1:
            cell.alignment = CENTER
        else:
            cell.alignment = LEFT

set_col_widths(ws_log, [14, 14, 14, 40, 16, 30])
ws_log.freeze_panes = "A5"

# Data validation: 이름 dropdown referencing 멤버목록
dv_name = DataValidation(
    type="list",
    formula1=f"=멤버!$A${MEM_START}:$A${MEM_START + MEM_ROWS - 1}",
    allow_blank=True,
)
dv_name.error = "멤버 시트에 등록된 이름만 선택할 수 있습니다."
dv_name.errorTitle = "이름 확인"
dv_name.prompt = "멤버 시트에 등록된 이름을 선택하세요."
dv_name.promptTitle = "이름 선택"
ws_log.add_data_validation(dv_name)
dv_name.add(f"B{LOG_START}:B{LOG_START + LOG_ROWS - 1}")

# Data validation: 카테고리 dropdown
dv_cat = DataValidation(
    type="list",
    formula1='"도서,교육,툴/구독,세미나/컨퍼런스,팀빌딩,기타"',
    allow_blank=True,
)
ws_log.add_data_validation(dv_cat)
dv_cat.add(f"C{LOG_START}:C{LOG_START + LOG_ROWS - 1}")

# Named ranges for log columns
wb.defined_names["사용_날짜"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "사용_날짜",
    attr_text=f"사용내역!$A${LOG_START}:$A${LOG_START + LOG_ROWS - 1}"
)
wb.defined_names["사용_이름"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "사용_이름",
    attr_text=f"사용내역!$B${LOG_START}:$B${LOG_START + LOG_ROWS - 1}"
)
wb.defined_names["사용_금액"] = __import__("openpyxl").workbook.defined_name.DefinedName(
    "사용_금액",
    attr_text=f"사용내역!$E${LOG_START}:$E${LOG_START + LOG_ROWS - 1}"
)


# =========================================================
# Sheet: 대시보드
# =========================================================
ws_dash = wb.create_sheet("대시보드", 0)  # make it the first sheet

ws_dash["A1"] = "Product Design TTB 예산 대시보드"
ws_dash["A1"].font = TITLE_FONT
ws_dash.row_dimensions[1].height = 32
ws_dash.merge_cells("A1:F1")

# --- Summary cards ---
ws_dash["A3"] = "전체 예산 현황"
ws_dash["A3"].font = SECTION_FONT
ws_dash.merge_cells("A3:F3")

summary_labels = [
    ("총 예산", "=총예산", KRW),
    ("총 사용액", "=SUM(사용_금액)", KRW),
    ("남은 예산", "=B5-B6", KRW),
    ("사용률", "=IFERROR(B6/B5,0)", PCT),
    ("월 평균 사용 가능액 (남은 기간)", "=IFERROR(B7/남은개월,0)", KRW),
    ("이번달 권장 한도", "=IFERROR(B7/남은개월,0)", KRW),
]

for i, (label, value, fmt) in enumerate(summary_labels):
    row = 5 + i
    ws_dash.cell(row=row, column=1, value=label).font = SUBHEADER_FONT
    ws_dash.cell(row=row, column=1).fill = SUBHEADER_FILL
    ws_dash.cell(row=row, column=1).alignment = LEFT
    ws_dash.cell(row=row, column=1).border = BORDER

    c = ws_dash.cell(row=row, column=2, value=value)
    c.font = Font(name="Pretendard", bold=True, size=12, color="111827")
    c.alignment = RIGHT
    c.number_format = fmt
    c.border = BORDER
    c.fill = KEY_FILL

# Conditional format for 사용률 cell (B8)
ws_dash.conditional_formatting.add(
    "B8",
    CellIsRule(operator="greaterThanOrEqual", formula=["0.9"],
               fill=PatternFill("solid", fgColor="FECACA"),
               font=Font(name="Pretendard", bold=True, color="991B1B"))
)
ws_dash.conditional_formatting.add(
    "B8",
    CellIsRule(operator="between", formula=["0.7", "0.9"],
               fill=PatternFill("solid", fgColor="FEF3C7"),
               font=Font(name="Pretendard", bold=True, color="92400E"))
)

# --- Per-person summary ---
ws_dash["A13"] = "사람별 사용 현황"
ws_dash["A13"].font = SECTION_FONT
ws_dash.merge_cells("A13:F13")

ws_dash["A14"] = (
    "💡 빨간색 = 1인 할당 초과 / 주황색 = 80% 이상 사용 / 초록색 = 안전. "
    "'경과기준 진도율'은 현재 시점에 써야할 만큼보다 얼마나 빠르게/느리게 쓰고 있는지를 보여줍니다."
)
ws_dash["A14"].font = MUTED_FONT
ws_dash.merge_cells("A14:F14")

person_headers = [
    "이름",
    "1인 할당",
    "사용액",
    "남은 액수",
    "사용률",
    "경과기준 진도율",
]
for i, h in enumerate(person_headers, start=1):
    ws_dash.cell(row=16, column=i, value=h)
style_header_row(ws_dash, 16, 1, 6)
ws_dash.row_dimensions[16].height = 28

# One row per member slot
PERSON_START = 17
for i in range(MEM_ROWS):
    row = PERSON_START + i
    mem_row = MEM_START + i
    # 이름
    ws_dash.cell(row=row, column=1,
                 value=f'=IF(멤버!A{mem_row}="","",멤버!A{mem_row})')
    # 1인 할당 (적용 할당)
    ws_dash.cell(row=row, column=2,
                 value=f'=IF(A{row}="","",멤버!D{mem_row})').number_format = KRW
    # 사용액 = SUMIF(사용_이름, 이름, 사용_금액)
    ws_dash.cell(
        row=row, column=3,
        value=f'=IF(A{row}="","",SUMIF(사용_이름,A{row},사용_금액))'
    ).number_format = KRW
    # 남은 액수
    ws_dash.cell(
        row=row, column=4,
        value=f'=IF(A{row}="","",B{row}-C{row})'
    ).number_format = KRW
    # 사용률
    ws_dash.cell(
        row=row, column=5,
        value=f'=IF(OR(A{row}="",B{row}=0),"",C{row}/B{row})'
    ).number_format = PCT
    # 경과기준 진도율 = 사용률 / (경과개월 / 총개월). 1보다 크면 과지출
    ws_dash.cell(
        row=row, column=6,
        value=(f'=IF(OR(A{row}="",B{row}=0,경과개월=0),"",'
               f'(C{row}/B{row})/(경과개월/총개월))')
    ).number_format = "0.00\"x\""

    for c in range(1, 7):
        cell = ws_dash.cell(row=row, column=c)
        cell.font = NORMAL_FONT
        cell.border = BORDER
        cell.alignment = LEFT if c == 1 else RIGHT

PERSON_END = PERSON_START + MEM_ROWS - 1

# Conditional formatting on 사용률 (column E) — visual flag for over-spenders
red_fill = PatternFill("solid", fgColor="FECACA")
red_font = Font(name="Pretendard", bold=True, color="991B1B")
orange_fill = PatternFill("solid", fgColor="FED7AA")
orange_font = Font(name="Pretendard", bold=True, color="9A3412")
green_fill = PatternFill("solid", fgColor="DCFCE7")
green_font = Font(name="Pretendard", color="166534")

usage_range = f"E{PERSON_START}:E{PERSON_END}"
# > 100% → red
ws_dash.conditional_formatting.add(
    usage_range,
    FormulaRule(formula=[f'AND(ISNUMBER(E{PERSON_START}),E{PERSON_START}>1)'],
                fill=red_fill, font=red_font)
)
# 80~100% → orange
ws_dash.conditional_formatting.add(
    usage_range,
    FormulaRule(
        formula=[f'AND(ISNUMBER(E{PERSON_START}),E{PERSON_START}>=0.8,E{PERSON_START}<=1)'],
        fill=orange_fill, font=orange_font)
)
# <80% & has data → green
ws_dash.conditional_formatting.add(
    usage_range,
    FormulaRule(
        formula=[f'AND(ISNUMBER(E{PERSON_START}),E{PERSON_START}<0.8,E{PERSON_START}>0)'],
        fill=green_fill, font=green_font)
)

# Highlight the entire row when usage > 100% — strong signal
row_overspend_range = f"A{PERSON_START}:F{PERSON_END}"
ws_dash.conditional_formatting.add(
    row_overspend_range,
    FormulaRule(
        formula=[f'AND($B{PERSON_START}>0,$C{PERSON_START}>$B{PERSON_START})'],
        fill=PatternFill("solid", fgColor="FEE2E2"))
)

# Conditional formatting on 경과기준 진도율 (column F)
pace_range = f"F{PERSON_START}:F{PERSON_END}"
# >1.5x: very over-pace → red
ws_dash.conditional_formatting.add(
    pace_range,
    FormulaRule(formula=[f'AND(ISNUMBER(F{PERSON_START}),F{PERSON_START}>1.5)'],
                fill=red_fill, font=red_font)
)
# 1.2~1.5x → orange
ws_dash.conditional_formatting.add(
    pace_range,
    FormulaRule(
        formula=[f'AND(ISNUMBER(F{PERSON_START}),F{PERSON_START}>=1.2,F{PERSON_START}<=1.5)'],
        fill=orange_fill, font=orange_font)
)

# Data bar for 사용액 column (visual proportion)
from openpyxl.formatting.rule import DataBarRule
ws_dash.conditional_formatting.add(
    f"C{PERSON_START}:C{PERSON_END}",
    DataBarRule(start_type="min", end_type="max",
                color="60A5FA", showValue=True)
)

set_col_widths(ws_dash, [16, 16, 16, 16, 12, 16])
ws_dash.freeze_panes = "A17"


# =========================================================
# Sheet: 카테고리별
# =========================================================
ws_cat = wb.create_sheet("카테고리별")
ws_cat["A1"] = "카테고리별 사용 현황"
ws_cat["A1"].font = TITLE_FONT
ws_cat.row_dimensions[1].height = 30
ws_cat.merge_cells("A1:C1")

cat_headers = ["카테고리", "사용액", "비중"]
for i, h in enumerate(cat_headers, start=1):
    ws_cat.cell(row=3, column=i, value=h)
style_header_row(ws_cat, 3, 1, 3)

categories = ["도서", "교육", "툴/구독", "세미나/컨퍼런스", "팀빌딩", "기타"]
for i, cat in enumerate(categories):
    row = 4 + i
    ws_cat.cell(row=row, column=1, value=cat).font = NORMAL_FONT
    ws_cat.cell(
        row=row, column=2,
        value=(
            f'=SUMIFS(사용_금액,'
            f'사용내역!$C${LOG_START}:$C${LOG_START + LOG_ROWS - 1},A{row})'
        )
    ).number_format = KRW
    ws_cat.cell(
        row=row, column=3,
        value=f'=IFERROR(B{row}/총예산,0)'
    ).number_format = PCT
    for c in range(1, 4):
        cell = ws_cat.cell(row=row, column=c)
        cell.border = BORDER
        cell.font = NORMAL_FONT
        cell.alignment = LEFT if c == 1 else RIGHT

# Total row
total_row = 4 + len(categories)
ws_cat.cell(row=total_row, column=1, value="합계").font = SUBHEADER_FONT
ws_cat.cell(row=total_row, column=1).fill = SUBHEADER_FILL
ws_cat.cell(row=total_row, column=2,
            value=f'=SUM(B4:B{total_row - 1})').number_format = KRW
ws_cat.cell(row=total_row, column=2).font = SUBHEADER_FONT
ws_cat.cell(row=total_row, column=2).fill = SUBHEADER_FILL
ws_cat.cell(row=total_row, column=3,
            value=f'=IFERROR(B{total_row}/총예산,0)').number_format = PCT
ws_cat.cell(row=total_row, column=3).font = SUBHEADER_FONT
ws_cat.cell(row=total_row, column=3).fill = SUBHEADER_FILL
for c in range(1, 4):
    ws_cat.cell(row=total_row, column=c).border = BORDER
    ws_cat.cell(row=total_row, column=c).alignment = (
        LEFT if c == 1 else RIGHT
    )

set_col_widths(ws_cat, [22, 16, 12])


# Save
out = "/home/user/yohan/product_design_ttb_budget.xlsx"
wb.save(out)
print(f"Saved: {out}")
