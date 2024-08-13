import cv2
import numpy as np
import os
from math import dist
from datetime import datetime

dataset_dir_name = "dataset"


class Grahph_similarity:
    def __init__(self, img):
        self.src = img
        self.height, self.width = self.src.shape[:2]
        self.pts = self.get_points(self.src)

    def get_points(self, img):
        pts = []
        # cv2.imsh ow("d", img)
        cv2.waitKey(0)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU)[1]
        for i in range(4, self.width):
            idxs = np.where(gray[:, i] == 0)
            if len(idxs[0]) == 0:
                pts.append([i, 0])
            else:
                pts.append([i, idxs[0][0]])
        return pts

    # def get_points(self, img):
    #     pts = []

    #     # Load the image
    #     img = cv2.imread(img)

    #     # Check if the image is loaded successfully
    #     if img is not None:
    #         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    #         gray = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU)[1]

    #         for i in range(4, self.width):
    #             idxs = np.where(gray[:, i] == 0)
    #             if len(idxs[0]) == 0:
    #                 pts.append([i, 0])
    #             else:
    #                 pts.append([i, idxs[0][0]])
    #     else:
    #         print(f"Error: Unable to load image {img}")

    #     return pts

    def calc_error(self, pts1, pts2):
        error = 0
        for i in range(len(pts1)):
            error += dist(pts1[i], pts2[i])
        return error

    def main(self):
        pts_error_data = []
        names = []
        for fname in os.listdir(dataset_dir_name):
            names.append(fname)
            img = cv2.imread(os.path.join(dataset_dir_name, fname))
            if img is not None:
                pts_error_data.append(
                    {
                        "name": fname,
                        "error": self.calc_error(self.pts, self.get_points(img)),
                    }
                )
        errors = []
        for error in pts_error_data:
            errors.append(error["error"])
        self.min_error = min(errors)

        pts_error_data = sorted(pts_error_data, key=lambda data: data["error"])
        src_name = pts_error_data[0]["name"]
        res = cv2.imread(os.path.join(dataset_dir_name, src_name))
        accuracy = np.round(100 - self.min_error / (self.width * self.height) * 200, 2)
        filtered_list = [element for element in names if src_name[:6] in element]

        sorted_array = sorted(
            filtered_list,
            key=lambda x: datetime.strptime(x[-23:-7], "%m-%d-%Y-%H-%M"),
        )
        after_name = sorted_array[
            min(sorted_array.index(src_name) + 1, len(sorted_array) - 1)
        ]
        after_img = cv2.imread(os.path.join(dataset_dir_name, after_name))
        return {
            "img": res,
            "accuracy": str(accuracy),
            "fname": src_name,
            "after_name": after_name,
            "after_img": after_img,
        }
