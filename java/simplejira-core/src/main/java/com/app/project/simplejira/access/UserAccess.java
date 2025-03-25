package com.app.project.simplejira.access;

import com.app.project.simplejira.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAccess extends JpaRepository<User, Long> {
}

