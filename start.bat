@echo off
chcp 65001 >nul
echo ========================================
echo   中英翻译助手 - 快速启动工具
echo ========================================
echo.
echo 请选择要执行的操作：
echo.
echo [1] 打开测试页面 (test.html)
echo [2] 打开图标生成器 (icon-generator.html)
echo [3] 打开Chrome扩展管理页面
echo [4] 打开Edge扩展管理页面
echo [5] 查看快速开始指南 (QUICKSTART.md)
echo [6] 查看安装指南 (INSTALL.md)
echo [7] 打开项目文件夹
echo [0] 退出
echo.
set /p choice=请输入选项 (0-7):

if "%choice%"=="1" (
    echo 正在打开测试页面...
    start test.html
) else if "%choice%"=="2" (
    echo 正在打开图标生成器...
    start icon-generator.html
) else if "%choice%"=="3" (
    echo 正在打开Chrome扩展管理页面...
    start chrome://extensions/
) else if "%choice%"=="4" (
    echo 正在打开Edge扩展管理页面...
    start msedge://extensions/
) else if "%choice%"=="5" (
    echo 正在打开快速开始指南...
    start QUICKSTART.md
) else if "%choice%"=="6" (
    echo 正在打开安装指南...
    start INSTALL.md
) else if "%choice%"=="7" (
    echo 正在打开项目文件夹...
    start .
) else if "%choice%"=="0" (
    echo 再见！
    exit
) else (
    echo 无效的选项，请重新运行脚本。
)

echo.
pause
