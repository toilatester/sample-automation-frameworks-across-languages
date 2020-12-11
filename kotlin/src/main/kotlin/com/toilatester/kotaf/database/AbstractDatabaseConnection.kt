package com.toilatester.kotaf.database

abstract class AbstractDatabaseConnection(
    isSSHRequired: Boolean = false,
    sshConfiguration: SSHConfiguration? = null
) : DatabaseConnection {
    init {
        if (isSSHRequired) {
            TODO("Connect to SSH server")
        }
    }

    override fun connect() {
        TODO("Connect to SSH server")
    }

    override fun disconnect() {
        TODO("Disconnect to SSH server")
    }
}
