import Markdown from "markdown-to-jsx";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Text, Textarea } from "theme-ui";
import { updateDiary } from "../../../features/diary/diariesSlice";
import {
  setCanEdit,
  setCurrentlyEditing,
} from "../../../features/entry/editorSlice";
import { updateEntry } from "../../../features/entry/entriesSlice";
import { Diary } from "../../../interfaces/diary.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { RootState } from "../../../redux/rootReducer";
import { AppDispatch } from "../../../redux/store";
import http from "../../../services/mirage/api";
import { showAlert } from "../../../services/mirage/util";

export const Editor = () => {
  const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
    (state: RootState) => state.editor
  );
  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useDispatch<AppDispatch>();

  const saveEntry = async () => {
    if (activeDiaryId === null)
      return showAlert("Please select a diary", "warning");

    if (entry === null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entry/${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data !== null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateDiary(diary));
          }
        });
    } else {
      http
        .put<Entry, Entry>(`/diaries/entry/${entry.id}`, editedEntry)
        .then((_entry) => {
          if (_entry !== null) {
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateEntry(_entry));
          }
        });
    }
    dispatch(setCanEdit(false));
  };

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  return (
    <div>
      <header>
        {entry && !canEdit ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Text
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                margin: "20px",
                marginRight: "5px",
              }}
            >
              {entry.title}
            </Text>
            <p
              onClick={(e) => {
                e.preventDefault();
                if (entry !== null) dispatch(setCanEdit(true));
              }}
              style={{
                margin: "auto 0",
                fontSize: "15px",
                color: "grey",
                cursor: "pointer",
              }}
            >
              {"(Edit)"}
            </p>
          </div>
        ) : (
          <Input
            value={editedEntry?.title ?? ""}
            disabled={!canEdit}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  title: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: e.target.value,
                  content: "",
                });
              }
            }}
            sx={{
              margin: "20px",
              width: "90%",
            }}
          />
        )}
      </header>
      {entry && !canEdit ? (
        <>
          <Markdown
            style={{ margin: "20px", fontSize: "20px", fontWeight: "normal" }}
          >
            {entry.content}
          </Markdown>
          <br />
        </>
      ) : (
        <Textarea
          disabled={!canEdit}
          placeholder="Supports markdown!"
          value={editedEntry?.content ?? ""}
          onChange={(e) => {
            if (editedEntry) {
              updateEditedEntry({
                ...editedEntry,
                content: e.target.value,
              });
            } else {
              updateEditedEntry({
                title: "",
                content: e.target.value,
              });
            }
          }}
          sx={{
            width: "90%",
            margin: "20px",
          }}
        />
      )}
      <Button
        onClick={saveEntry}
        disabled={!canEdit}
        sx={{
          margin: "20px",
        }}
      >
        Save
      </Button>
    </div>
  );
};
