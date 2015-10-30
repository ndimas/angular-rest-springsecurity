package com.telco.sampleApp.dao;

import java.util.List;

import com.telco.sampleApp.entity.Entity;


public interface Dao<T extends Entity, I>
{

	List<T> findAll();


	T find(I id);


	T save(T newsEntry);


	void delete(I id);

}