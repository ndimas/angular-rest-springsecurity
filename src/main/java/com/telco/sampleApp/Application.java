package com.telco.sampleApp;

import com.telco.sampleApp.config.JerseyConfig;
import org.apache.commons.logging.Log;
import org.glassfish.jersey.servlet.ServletContainer;
import org.glassfish.jersey.servlet.ServletProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.web.filter.CharacterEncodingFilter;

@SpringBootApplication
@Configuration
@ImportResource({"classpath:context.xml"})
public class Application extends SpringBootServletInitializer {

    protected Log logger;


    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public ServletRegistrationBean jerseyServlet() {

        ServletContainer container = new ServletContainer();
        ServletRegistrationBean registration = new ServletRegistrationBean(container, "/rest/*");

        registration.addInitParameter(ServletProperties.JAXRS_APPLICATION_CLASS, JerseyConfig.class.getName());
        registration.addInitParameter("com.sun.jersey.api.json.POJOMappingFeature", "true");
        registration.addInitParameter("com.sun.jersey.config.property.packages", "net.dontdrinkandroot.example.angularrestspringsecurity.rest");

        return registration;
    }


        @Bean
    public CharacterEncodingFilter characterEncodingFilter() {
        final CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceEncoding(true);
        return characterEncodingFilter;
    }
}