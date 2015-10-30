package com.telco.sampleApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SpringBootApplication
@Configuration
@EnableGlobalMethodSecurity
@ImportResource("classpath:context.xml")
/*@ComponentScan({"cy.mtn.example.dao",
                "cy.mtn.example.rest"})*/
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // Customize the application or call application.sources(...) to add sources
        // Since our example is itself a @Configuration class we actually don't
        // need to override this method.
        application.sources(Application.class);

        return application;
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}