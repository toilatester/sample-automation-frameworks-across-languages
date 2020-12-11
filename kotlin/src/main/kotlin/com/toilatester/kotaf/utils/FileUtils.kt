package com.toilatester.kotaf.utils

import java.io.File
import java.net.URLDecoder

/*
TODO : display a friendly message
 */
fun getResourcesPath(relativePath: String, enc: String = "UTF-8"): String {
    if (relativePath.startsWith(File.separator)) {
        throw IllegalArgumentException("Path must not start with ${File.separator}")
    }
    return with(ClassLoader.getSystemClassLoader().getResource(relativePath).path) {
        URLDecoder.decode(this, enc)
    }
}
