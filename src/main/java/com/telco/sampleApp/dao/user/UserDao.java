package com.telco.sampleApp.dao.user;

import com.telco.sampleApp.entity.User;
import com.telco.sampleApp.dao.Dao;

import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserDao extends Dao<User, Long>, UserDetailsService
{

	User findByName(String name);

}