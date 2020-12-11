package com.toilatester.kotaf.data

import com.toilatester.kotaf.utils.dbName
import org.jetbrains.exposed.sql.Table

object FeedbackTable : Table("$dbName.feedbacks") {
    val providerName = text("ProviderName")
    val providedDate = date("CreatedDate")
    val content = text("Content")
    val groupId = integer("FBGroupFk")
    val providerId = integer("CreatedBy_id")
    val receiverId = integer("Receiver_id")
    val isShared = bool("IsShared")
    val status = customEnumeration(
        "Status",
        "ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'DELETED')",
        { value -> Status.fromInt(value as Int) },
        { it.value })
}

data class Feedback(
    val receiverName: String,
    val providedDate: String = "",
    val status: Status = Status.APPROVED,
    val providerName: String = "",
    val isShared: Boolean = true
)

enum class Status(val value: Int) {
    DRAFT(0),
    PENDING(1),
    APPROVED(2),
    DISAPPROVED(3),
    DELETED(4);

    companion object {
        fun fromInt(value: Int) = Status.values().first { it.value == value }
    }
}
