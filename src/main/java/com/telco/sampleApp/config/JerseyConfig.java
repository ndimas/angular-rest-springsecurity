package com.telco.sampleApp.config;

import com.telco.sampleApp.rest.resources.NewsEntryResource;
import com.telco.sampleApp.rest.resources.UserResource;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

/**
 * Created by ndimas on 30/10/2015.
 */
@ApplicationPath("/rest")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        packages("com.telco.sampleApp.rest");
        register(NewsEntryResource.class);
        register(UserResource.class);
    }
}
