<?php

class Router
{
    private array $routes = [];

    public function get(string $path, array $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function dispatch(string $uri, string $method): void
    {
        $path = parse_url($uri, PHP_URL_PATH);

        if (isset($this->routes[$method][$path])) {
            [$controller, $action] = $this->routes[$method][$path];

            $instance = new $controller();

            $instance->$action();

            return;
        }

        http_response_code(404);

        echo 'Page non trouvée';
    }
}