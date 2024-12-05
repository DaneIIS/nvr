"""Face recognition constants."""
from typing import Final

DOMAIN: Final = "face_recognition"

UNKNOWN_FACE = "unknown"

# Event topic constants
EVENT_FACE_DETECTED = "{camera_identifier}/face/detected/{face}"
EVENT_FACE_EXPIRED = "{camera_identifier}/face/expired/{face}"


# BASE_CONFIG_SCHEMA constants
CONFIG_CAMERAS = "cameras"

CONFIG_FACE_RECOGNITION_PATH = "face_recognition_path"
CONFIG_SAVE_FACES = "save_faces"
CONFIG_SAVE_UNKNOWN_FACES = "save_unknown_faces"
CONFIG_UNKNOWN_FACES_PATH = "unknown_faces_path"
CONFIG_EXPIRE_AFTER = "expire_after"

DEFAULT_FACE_RECOGNITION_PATH = "/config/face_recognition/faces"
DEFAULT_SAVE_FACES = True
DEFAULT_SAVE_UNKNOWN_FACES = True
DEFAULT_EXPIRE_AFTER = 5

DESC_SAVE_FACES = (
    "If set to <code>true</code>, detected faces will be stored "
    "in the database, as well as having a snapshot saved."
)
DESC_FACE_RECOGNITION_PATH = (
    "Path to folder which contains subdirectories with images for each face to track."
)
DESC_SAVE_UNKNOWN_FACES = (
    "If set to <code>true</code>, any unrecognized faces will be stored "
    "in the database, as well as having a snapshot saved. You can then move this "
    "image to the folder of the correct person to improve accuracy."
)
DESC_UNKNOWN_FACES_PATH = "Path to folder where unknown faces will be stored."
DESC_EXPIRE_AFTER = (
    "Time in seconds before a detected face is no longer considered detected."
)
