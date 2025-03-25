package com.app.project.simplejira.access;

import com.app.project.simplejira.model.Task;
import com.app.project.simplejira.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAccess extends JpaRepository<Task, Long> {
    List<Task> findAllByUser(User user);

}

