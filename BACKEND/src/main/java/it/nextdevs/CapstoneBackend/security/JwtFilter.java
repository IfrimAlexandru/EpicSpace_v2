package it.nextdevs.CapstoneBackend.security;


import it.nextdevs.CapstoneBackend.exceptions.NotFoundException;
import it.nextdevs.CapstoneBackend.exceptions.UnauthorizedException;
import it.nextdevs.CapstoneBackend.model.User;
import it.nextdevs.CapstoneBackend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTool jwtTool;

    @Autowired
    private UserService utenteService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        // Verifica se c'è un token JWT valido
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                jwtTool.verifyToken(token);

                int userId = jwtTool.getIdFromToken(token);

                Optional<User> utenteOptional = utenteService.getUserById(userId);

                if (utenteOptional.isPresent()) {
                    User user = utenteOptional.get();

                    Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    throw new NotFoundException("Utente non trovato con id " + userId);
                }
            } catch (UnauthorizedException e) {
                System.err.println(e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath());

    }

}
