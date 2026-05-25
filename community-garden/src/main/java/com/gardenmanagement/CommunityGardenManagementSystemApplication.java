package com.gardenmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
 
@SpringBootApplication
public class CommunityGardenManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommunityGardenManagementSystemApplication.class, args);
        System.out.println("✅ Community Garden Management System is running on port 8080");
    }
}
