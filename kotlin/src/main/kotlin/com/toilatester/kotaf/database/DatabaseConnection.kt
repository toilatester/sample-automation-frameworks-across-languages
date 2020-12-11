package com.toilatester.kotaf.database

interface DatabaseConnection {
    fun connect()
    fun disconnect()
}

data class SSHConfiguration(
    val sshHost: String = "127.0.0.1",
    val sshPort: Int = 22,
    val sshUsername: String = "",
    val sshPassword: String = "",
    val localBindingHost: String = "127.0.0.1",
    val localBindingPort: Int = 27017,
    val remoteBindingHost: String = "127.0.0.1",
    val remoteBindingPort: Int = 27017
)
