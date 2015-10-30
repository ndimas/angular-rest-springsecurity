package com.mtn.proofOfConcept.dao;

import com.mtn.proofOfConcept.entity.Entity;

import java.util.List;


public interface Dao<T extends Entity, I>
{

	List<T> findAll();


	T find(I id);


	T save(T newsEntry);


	void delete(I id);

}