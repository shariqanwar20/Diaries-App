import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Box, Text, Flex, Button, Input } from "theme-ui";
import { updateDiary } from "../../../features/diary/diariesSlice";
import {
  setActiveDiaryId,
  setCanEdit,
  setCurrentlyEditing,
} from "../../../features/entry/editorSlice";
import { Diary } from "../../../interfaces/diary.interface";
import { AppDispatch } from "../../../redux/store";
import http from "../../../services/mirage/api";
import { showAlert } from "../../../services/mirage/util";

interface Props {
  diary: Diary;
}

export const DiaryTile: React.FC<Props> = (props) => {
  const [diary, setDiary] = useState(props.diary);
  const totalEntries = props.diary.entryIds?.length;
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const saveChanges = async () => {
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((_diary) => {
        if (_diary) {
          dispatch(updateDiary(_diary));
          showAlert("Saved", "success");
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          borderRadius: "15px",
          boxShadow: "0px 0px 5px grey",
          padding: "20px 20px",
          marginBottom: "10px",
        }}
      >
        {!isEditing ? (
          <Text
            title="Click To Edit"
            sx={{ cursor: "pointer", fontSize: "30px", textAlign: "center" }}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {diary.title}
          </Text>
        ) : (
          <Input
            value={diary.title}
            onChange={(e) => {
              setDiary({
                ...diary,
                title: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                saveChanges();
              }
            }}
          />
        )}
        <Text sx={{ textAlign: "center", opacity: "0.7" }}>
          {totalEntries ?? "0"} saved entries
        </Text>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Text sx={{ color: "darkgreen" }}>Created At: </Text>
          <Text sx={{ marginLeft: "15px" }}>{diary.createdAt}</Text>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Text sx={{ color: "yellow" }}>Updated At: </Text>
          <Text sx={{ marginLeft: "10px" }}>{diary.updatedAt}</Text>
        </div>
        <Flex sx={{ justifyContent: "space-around", marginTop: "10px" }}>
          <Button
            sx={{ borderRadius: "7px" }}
            onClick={() => {
              dispatch(setCanEdit(true));
              dispatch(setActiveDiaryId(diary.id as string));
              dispatch(setCurrentlyEditing(null));
            }}
          >
            {/* icon button */}
            Add New Entry
          </Button>
          <Link to={`/diary/${diary.id}`}>
            <Button>View All →</Button>
          </Link>
        </Flex>
      </Box>
    </div>
  );
};
