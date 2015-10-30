package com.mtn.proofOfConcept.dao.user;

import com.mtn.proofOfConcept.dao.Dao;
import com.mtn.proofOfConcept.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserDao extends Dao<User, Long>, UserDetailsService
{

	User findByName(String name);

}