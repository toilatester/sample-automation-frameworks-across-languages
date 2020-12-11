package com.toilatester.kotaf.utils

import com.beust.klaxon.Klaxon
import com.toilatester.kotaf.configuration
import com.toilatester.kotaf.database.DataSource
import com.toilatester.kotaf.database.SQLConnection

const val dbName = "patest2"
val database by lazy {
    val dataSource = Klaxon().parse<DataSource>(configuration.obj("paDataSource")?.toJsonString()!!)
        ?: DataSource()
    SQLConnection(dataSource)
}
