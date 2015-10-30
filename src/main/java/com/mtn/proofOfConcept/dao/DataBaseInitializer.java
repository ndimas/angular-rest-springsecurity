package com.mtn.proofOfConcept.dao;

import java.util.Date;

import com.mtn.proofOfConcept.dao.newsentry.NewsEntryDao;
import com.mtn.proofOfConcept.dao.user.UserDao;
import com.mtn.proofOfConcept.entity.User;
import com.mtn.proofOfConcept.entity.NewsEntry;

import org.springframework.security.crypto.password.PasswordEncoder;


/**
 * Initialize the database with some test entries.
 * 
 * @author Philip W. Sorst <philip@sorst.net>
 */
public class DataBaseInitializer
{

	private NewsEntryDao newsEntryDao;

	private UserDao userDao;

	private PasswordEncoder passwordEncoder;


	protected DataBaseInitializer()
	{
		/* Default constructor for reflection instantiation */
	}


	public DataBaseInitializer(UserDao userDao, NewsEntryDao newsEntryDao, PasswordEncoder passwordEncoder)
	{
		this.userDao = userDao;
		this.newsEntryDao = newsEntryDao;
		this.passwordEncoder = passwordEncoder;
	}


	public void initDataBase()
	{
		User userUser = new User("user", this.passwordEncoder.encode("user"));
		userUser.addRole("user");
		this.userDao.save(userUser);

		User adminUser = new User("admin", this.passwordEncoder.encode("admin"));
		adminUser.addRole("user");
		adminUser.addRole("admin");
		this.userDao.save(adminUser);

		long timestamp = System.currentTimeMillis() - 1000 * 60 * 60 * 24;
		for (int i = 0; i < 10; i++) {
			NewsEntry newsEntry = new NewsEntry();
			newsEntry.setContent("This is example content " + i);
			newsEntry.setDate(new Date(timestamp));
			this.newsEntryDao.save(newsEntry);
			timestamp += 1000 * 60 * 60;
		}
	}

}