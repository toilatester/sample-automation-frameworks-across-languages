package com.toilatester.kotaf.database

import org.jetbrains.exposed.sql.Database

data class DataSource(
    val connectionString: String = "",
    val driver: String = "",
    val user: String = "",
    val password: String = ""
)

class SQLConnection(
    private val dataSource: DataSource,
    isSSHRequired: Boolean = false,
    sshConfiguration: SSHConfiguration? = null
) : AbstractDatabaseConnection(isSSHRequired, sshConfiguration) {
    private var isConnected = false
    override fun connect() {
        if (!isConnected) {
            dataSource.run {
                Database.connect(
                    url = connectionString,
                    driver = driver,
                    user = user,
                    password = password
                )
            }
            isConnected = true
        }
    }
}
