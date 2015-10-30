package com.mtn.proofOfConcept.dao.newsentry;

import com.mtn.proofOfConcept.entity.NewsEntry;
import com.mtn.proofOfConcept.dao.Dao;


/**
 * Definition of a Data Access Object that can perform CRUD Operations for {@link NewsEntry}s.
 * 
 * @author Philip W. Sorst <philip@sorst.net>
 */
public interface NewsEntryDao extends Dao<NewsEntry, Long>
{

}