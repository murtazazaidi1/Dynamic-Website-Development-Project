
<?php

// Starts or resumes the current PHP session.
function startUserSession(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function getSessionUserId(): ?int
{
    startUserSession();

    if (!isset($_SESSION['uid'])) {
        return null;
    }

    $uid = filter_var(
        $_SESSION['uid'],
        FILTER_VALIDATE_INT
    );

    return ($uid !== false && $uid > 0) ? $uid : null;
}

// Stores the authenticated user's ID after login.
function setSessionUserId(int $uid): void
{
    startUserSession();

    session_regenerate_id(true);
    $_SESSION['uid'] = $uid;
}

// Clears the current authenticated session.
function clearUserSession(): void
{
    startUserSession();

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();

        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'],
            'domain' => $params['domain'],
            'secure' => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => $params['samesite'] ?? 'Lax',
        ]);
    }

    session_destroy();
}
