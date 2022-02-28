package pharmcadd.form.controller.front

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import pharmcadd.form.common.controller.BaseController
import pharmcadd.form.common.exception.BadRequest
import pharmcadd.form.common.exception.NotFound
import pharmcadd.form.controller.front.form.ChangePasswordForm
import pharmcadd.form.controller.front.form.JoinForm
import pharmcadd.form.model.UserDetail
import pharmcadd.form.service.UserService

@RestController
@RequestMapping("/users/self")
class SelfController : BaseController() {

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    @GetMapping
    fun detail(): UserDetail {
        return userService.detail(securityService.userId) ?: throw NotFound()
    }

    @PatchMapping("/password")
    fun changePassword(@RequestBody form: ChangePasswordForm) {
        val user = userService.findOne(securityService.userId) ?: throw NotFound()
        if (passwordEncoder.matches(form.password, user.password).not()) {
            throw BadRequest()
        } else {
            userService.changePassword(user.id, form.newPassword)
        }
    }

    @PostMapping("/groups")
    fun addGroup(@RequestBody form: JoinForm.Group) {
        userService.addGroup(securityService.userId, form.groupId, form.positionId)
    }

    @DeleteMapping("/groups/{groupId}")
    fun deleteGroup(@PathVariable("groupId") groupId: Long) {
        userService.deleteGroup(securityService.userId, groupId)
    }

    @DeleteMapping("/positions/{positionId}")
    fun deletePosition(@PathVariable("positionId") positionId: Long) {
        userService.deletePosition(securityService.userId, positionId)
    }
}
