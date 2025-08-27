@echo off
REM Website preparation batch script
REM Preserves both style.css and swiper-bundle.min.css

setlocal enabledelayedexpansion

REM Get current folder name and path
for %%i in ("%~dp0.") do set "FOLDER_NAME=%%~nxi"
set "SOURCE_PATH=%~dp0."
set "DESTINATION=D:\realiz\%FOLDER_NAME%"
set "ZIP_FILE=D:\realiz\%FOLDER_NAME%.zip"

echo Preparing website for hosting...
echo Source:      %SOURCE_PATH%
echo Destination: %DESTINATION%
echo Zip file:    %ZIP_FILE%

REM Step 1: Create destination folder
if not exist "%DESTINATION%" mkdir "%DESTINATION%"

REM Step 2: Copy excluding batch file and .git folder
echo Copying files (excluding .git and batch file)...
robocopy "%SOURCE_PATH%" "%DESTINATION%" /E /XD .git /XF prepare_for_hosting.bat /NFL /NDL /NJH /NJS
if %errorlevel% gtr 1 (
    echo Error copying files
    pause
    exit /b 1
)

REM Step 3: Clean destination folder
pushd "%DESTINATION%"

echo Cleaning up unnecessary files and folders...

REM Remove any remaining .git folder
if exist ".git" (
    echo Removing .git folder
    rd /s /q ".git"
)

REM Keep only specified folders
for /d %%d in (*) do (
    set "KEEP=0"
    for %%f in (fonts img js vid news modules css) do (
        if "%%d" == "%%f" set "KEEP=1"
    )
    if !KEEP! == 0 (
        echo Removing folder: %%d
        rd /s /q "%%d"
    )
)

REM Keep only index.html in root
for %%f in (*) do (
    if /i not "%%f" == "index.html" (
        echo Removing file: %%f
        del /q "%%f"
    )
)

REM Clean css folder (keep style.css AND swiper-bundle.min.css)
if exist "css" (
    pushd "css"
    for %%f in (*) do (
        if /i not "%%f" == "style.css" (
            if /i not "%%f" == "swiper-bundle.min.css" (
                echo Removing file: css\%%f
                del /q "%%f"
            )
        )
    )
    for /d %%d in (*) do (
        echo Removing folder: css\%%d
        rd /s /q "%%d"
    )
    popd
)

REM Step 4: Create zip archive
echo Creating zip archive...
powershell -command "Compress-Archive -Path '%DESTINATION%' -DestinationPath '%ZIP_FILE%' -Force"
if %errorlevel% neq 0 (
    echo Error creating zip file
    pause
    exit /b 1
)

REM Complete
popd
echo Preparation complete!
echo Final zip file created at: %ZIP_FILE%
pause