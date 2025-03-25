package com.app.project.simplejira;

import com.app.project.simplejira.access.TaskAccess;
import com.app.project.simplejira.access.UserAccess;
import com.app.project.simplejira.model.Task;
import com.app.project.simplejira.model.User;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@SpringBootApplication
public class JiraDataGenerator implements CommandLineRunner {

    @Autowired
    private UserAccess userAccess;

    @Autowired
    private TaskAccess taskAccess;

    public static void main(String[] args) {
        SpringApplication.run(JiraDataGenerator.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        userAccess.deleteAll();
        taskAccess.deleteAll();
        generateTestData();
        generateTestData(userAccess.findAll());
    }

    private void generateTestData() {
        Faker faker = new Faker();
        for (int i = 0; i < 5; i++) {
            User user = new User();
            user.setName(faker.name().fullName());
            user.setEmail(faker.internet().emailAddress());
            userAccess.save(user);
        }
    }

    private void generateTestData(List<User> users) {
        Faker faker = new Faker();
        for (int i = 0; i < 10; i++) {
            Task task = new Task();
            task.setTitle(faker.company().buzzword());
            task.setDescription(faker.lorem().sentence());
            task.setDueDate(generateRandomDueDate());
            task.setStatus(getRandomStatus());
            task.setUser(getRandomUser(users));
            taskAccess.save(task);
        }
    }

    private User getRandomUser(List<User> users) {
        if (users == null || users.isEmpty()) {
            return null;
        }
        Random random = new Random();
        int randomIndex = random.nextInt(users.size());
        return users.get(randomIndex);
    }

    private Task.Status getRandomStatus() {
        return ThreadLocalRandom.current().nextBoolean() ? Task.Status.PENDING : Task.Status.COMPLETED;
    }

    private long generateRandomDueDate() {
        long randomDays = ThreadLocalRandom.current().nextLong(1, 31); // 1 to 30 days in the future
        return LocalDate.now().plusDays(randomDays).atStartOfDay().toEpochSecond(java.time.ZoneOffset.UTC);
    }

}
