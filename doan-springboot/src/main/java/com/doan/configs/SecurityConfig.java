package com.doan.configs;

import com.doan.services.MyUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final MyUserDetailsService myUserDetailsService;

    public SecurityConfig(MyUserDetailsService myUserDetailsService) {
        this.myUserDetailsService = myUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()

                .requestMatchers("/api/auth/**", "/swagger-ui.html", "/v2/api-docs", "/swagger-resources/**", "/webjars/**").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()

                // User truy cặp người dùng của họ
                .requestMatchers(HttpMethod.GET, "/api/users/by-username/{username}").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/{id}").authenticated()

                // Cho phép truy cập công khai cho các endpoint tài liệu
                .requestMatchers(HttpMethod.GET, "/api/documents/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/courses/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/software/**").permitAll()

                // Comment
                .requestMatchers(HttpMethod.GET, "/api/comments/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/comments").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/comments/**").authenticated()
                //Rating
                .requestMatchers(HttpMethod.GET, "/api/ratings/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/ratings").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/ratings/**").authenticated()

                // Admin
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/documents/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/documents/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/documents/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/software/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/software/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/software/**").hasRole("ADMIN")

                // user cập nhật giỏ hàng
                .requestMatchers(HttpMethod.GET, "/api/cart/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/cart/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/cart/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/cart/**").authenticated()

                .anyRequest().authenticated()
                .and()
                .httpBasic();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return myUserDetailsService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(myUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.authenticationProvider(authenticationProvider());
        return authManagerBuilder.build();
    }
}