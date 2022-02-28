package pharmcadd.form.controller.admin

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pharmcadd.form.common.controller.BaseController
import pharmcadd.form.common.util.pagination.DataTablePagination
import pharmcadd.form.controller.admin.form.AnswerStatListForm
import pharmcadd.form.jooq.Tables.ANSWER_STAT
import pharmcadd.form.jooq.Tables.CAMPAIGN
import pharmcadd.form.jooq.tables.pojos.AnswerStat

@RestController
@RequestMapping("/admin/answer-stats")
class AnswerStatController : BaseController() {

    @GetMapping
    fun list(form: AnswerStatListForm): DataTablePagination<AnswerStat> {
        val query = dsl
            .select(
                *ANSWER_STAT.fields()
            )
            .from(ANSWER_STAT)
            .innerJoin(CAMPAIGN).on(CAMPAIGN.ID.eq(ANSWER_STAT.CAMPAIGN_ID).and(CAMPAIGN.DELETED_AT.isNull))
            .where(
                ANSWER_STAT.DELETED_AT.isNull
            )

        if (form.campaignId != null) {
            query.and(CAMPAIGN.ID.eq(form.campaignId))
        }
        if (form.formId != null) {
            query.and(CAMPAIGN.FORM_ID.eq(form.formId))
        }

        return DataTablePagination.of(dsl, query, form) {
            it.into(AnswerStat::class.java)
        }
    }
}
