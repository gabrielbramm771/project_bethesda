<?php
// ============ BACKEND ============
// Endpoint: GET/POST /backend/api_logout.php

session_start();
header('Content-Type: application/json');
session_destroy();
echo json_encode(['success' => true]);
