package pharmcadd.form.common.util.excel

import org.apache.poi.xssf.streaming.SXSSFRow
import org.apache.poi.xssf.streaming.SXSSFSheet
import org.apache.poi.xssf.streaming.SXSSFWorkbook
import java.time.LocalDate
import java.time.format.DateTimeFormatter

open class Excel {

    private val wb = SXSSFWorkbook()
    private var curRow = 0
    private val MAX_ROW_PER_SHEET = 65535

    fun generate(header: List<String>, body: List<List<Any>>): SXSSFWorkbook {
        val now = LocalDate.now()
        val pattern = DateTimeFormatter.ofPattern("YYYY-MM-DD")
        val sheetTitle = now.format(pattern).toString()

        val sheet = sheet(sheetTitle)

        val bodyRowCount = validateRowCount(body)

        val headerRows = sheet.generateRow(curRow++, 1)
        val bodyRows = sheet.generateRow(curRow, bodyRowCount)

        headerCell(headerRows, header)
        bodyCell(bodyRows, body)

        return this.wb
    }

    private fun validateRowCount(data: List<List<Any>>): Int {
        if (data.isEmpty()) {
            return 0
        }

        if (data.size < MAX_ROW_PER_SHEET) {
            return data.size
        } else {
            throw Exception()
        }
    }

    private fun sheet(title: String): SXSSFSheet {
        return this.wb.createSheet(title)
    }

    private fun SXSSFSheet.generateRow(curRow: Int, rowCount: Int): MutableList<SXSSFRow> {
        val rowList = mutableListOf<SXSSFRow>()
        (curRow..rowCount).forEach {
            rowList.add(this.createRow(it))
        }
        return rowList
    }

    private fun headerCell(rows: MutableList<SXSSFRow>, data: List<String>) {
        data.mapIndexed { index, column ->
            rows[0].createCell(index).setCellValue(column)
        }
    }

    private fun bodyCell(rows: MutableList<SXSSFRow>, data: List<List<Any>>) {
        val rowSize = rows.size
        val columnSize = data[0].size

        (0 until rowSize).forEach{ rowNum ->
            val record = data[rowNum]
            (0 until columnSize).forEach { colNum ->
                rows[rowNum].createCell(colNum).setCellValue(record[colNum].toString())
            }
        }
    }
}





