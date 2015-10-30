package com.mtn.proofOfConcept.config;

import com.mtn.proofOfConcept.rest.resources.NewsEntryResource;
import com.mtn.proofOfConcept.rest.resources.UserResource;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

/**
 * Created by ndimas on 30/10/2015.
 */
@ApplicationPath("/rest")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        packages("com.mtn.proofOfConcept.rest");
        register(NewsEntryResource.class);
        register(UserResource.class);
    }
}
