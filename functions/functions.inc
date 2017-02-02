<?
    // function readableMode($perms) {
    //     switch ($perms & 0xF000) {
    //         case 0xC000: // socket
    //             $info = 's';
    //             break;
    //         case 0xA000: // symbolic link
    //             $info = 'l';
    //             break;
    //         case 0x8000: // regular
    //             $info = '-';
    //             break;
    //         case 0x6000: // block special
    //             $info = 'b';
    //             break;
    //         case 0x4000: // directory
    //             $info = 'd';
    //             break;
    //         case 0x2000: // character special
    //             $info = 'c';
    //             break;
    //         case 0x1000: // FIFO pipe
    //             $info = 'p';
    //             break;
    //         default: // unknown
    //             $info = 'u';
    //     }
    //     // Autres
    //     $info .= $perms & 0x0100 ? 'r' : '-';
    //     $info .= $perms & 0x0080 ? 'w' : '-';
    //     $info .= $perms & 0x0040 ? ($perms & 0x0800 ? 's' : 'x' ) : ($perms & 0x0800 ? 'S' : '-');

    //     // Groupe
    //     $info .= $perms & 0x0020 ? 'r' : '-';
    //     $info .= $perms & 0x0010 ? 'w' : '-';
    //     $info .= $perms & 0x0008 ? ($perms & 0x0400 ? 's' : 'x' ) : ($perms & 0x0400 ? 'S' : '-');

    //     // Tout le monde
    //     $info .= $perms & 0x0004 ? 'r' : '-';
    //     $info .= $perms & 0x0002 ? 'w' : '-';
    //     $info .= $perms & 0x0001 ? ($perms & 0x0200 ? 't' : 'x' ) : ($perms & 0x0200 ? 'T' : '-');
    //     return $info;
    // }
    function getFileMimeType($file_location, $file_name = "") {
        if (function_exists('finfo_file')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $type = @finfo_file($finfo, $file_location);
            finfo_close($finfo);
        } else {
            $type = mime_content_type($file_location);
        }

        if (!$type || in_array($type, array('application/octet-stream', 'text/plain'))) {
            $secondOpinion = exec('file -b --mime-type ' . escapeshellarg($file_location), $foo, $returnCode);
            if ($returnCode === 0 && $secondOpinion) {
                $type = $secondOpinion;
            }
        }

        if (!$type || in_array($type, array('application/octet-stream', 'text/plain'))) {
            $mime = @json_decode(file_get_contents("../json/mime.json"), true)[@array_pop(explode('.', $file_name))];
            if (isset($mime)) {
                $type = $mime;
            }
        }
        if (!$type || in_array($type, array('application/octet-stream', 'text/plain'))) {
            $exifImageType = @exif_imagetype($file_location);
            if ($exifImageType !== false) {
                $type = image_type_to_mime_type($exifImageType);
            }
        }

        return $type;
    }
?>