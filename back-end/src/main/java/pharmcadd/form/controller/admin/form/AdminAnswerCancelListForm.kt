package pharmcadd.form.controller.admin.form

import pharmcadd.form.common.util.pagination.DataTableForm
import pharmcadd.form.jooq.enums.ApprovalType

class AdminAnswerCancelListForm : DataTableForm() {
    var type: ApprovalType? = null
    var requester: String? = null
    var approver: String? = null
}
