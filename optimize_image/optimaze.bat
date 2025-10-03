@echo off
setlocal enabledelayedexpansion

:: Check if ImageMagick is installed
where magick >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: ImageMagick is not installed or not in PATH.
    echo Please install ImageMagick first: https://imagemagick.org/
    pause
    exit /b 1
)

:: Create output directory if it doesn't exist
set "output_dir=optimized_images"
if not exist "%output_dir%" (
    mkdir "%output_dir%"
    echo Created output directory: %output_dir%
)

:: Process JPG files
echo Processing JPG files...
for %%f in (*.jpg *.jpeg) do (
    echo Optimizing %%f...
    
    :: MOZJPEG
    magick "%%f" -quality 90 -define jpeg:optimize-coding=true "%output_dir%\%%~nf.jpg" && echo Created MOZJPEG version
    
    :: AVIF
    magick "%%f" -quality 90 "%output_dir%\%%~nf.avif" && echo Created AVIF version
    
    :: WEBP
    magick "%%f" -quality 90 "%output_dir%\%%~nf.webp" && echo Created WEBP version
)

:: Process PNG files
echo Processing PNG files...
for %%f in (*.png) do (
    echo Optimizing %%f...
    
    :: OxiPNG (requires oxipng installed)
    where oxipng >nul 2>&1
    if %errorlevel% == 0 (
        oxipng -o 5 "%%f" -q --out "%output_dir%\%%~nf.png" && echo Created OxiPNG version
    ) else (
        echo Warning: oxipng not found. Using ImageMagick for PNG optimization.
        magick "%%f" -quality 90 "%output_dir%\%%~nf.png" && echo Created optimized PNG version
    )
    
    :: AVIF
    magick "%%f" -quality 90 "%output_dir%\%%~nf.avif" && echo Created AVIF version
    
    :: WEBP
    magick "%%f" -quality 90 "%output_dir%\%%~nf.webp" && echo Created WEBP version
)

echo All images have been processed and saved to %output_dir% folder.
pause