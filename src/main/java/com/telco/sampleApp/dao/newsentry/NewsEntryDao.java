package com.telco.sampleApp.dao.newsentry;

import com.telco.sampleApp.entity.NewsEntry;
import com.telco.sampleApp.dao.Dao;


/**
 * Definition of a Data Access Object that can perform CRUD Operations for {@link NewsEntry}s.
 * 
 * @author Philip W. Sorst <philip@sorst.net>
 */
public interface NewsEntryDao extends Dao<NewsEntry, Long>
{

}