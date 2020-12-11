
package com.mh.ta.core.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.mh.ta.core.config.enums.TestStatus;



/**
 * @author minhhoang
 *
 */
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface RecordVideo {
	public boolean enabled() default false;

	public String videoName() default "VideoRecord";

	public TestStatus saveOnTestStatus() default TestStatus.FAILED;
}
