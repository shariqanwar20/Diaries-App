import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  setCanEdit,
  setCurrentlyEditing,
} from "../../../features/entry/editorSlice";
import { setEntries } from "../../../features/entry/entriesSlice";
import { RootState } from "../../../redux/rootReducer";
import { AppDispatch } from "../../../redux/store";
import http from "../../../services/mirage/api";
import { Box, Flex } from "theme-ui";

export const DiaryEntriesList = () => {
  const entries = useSelector((state: RootState) => state.entries);
  const dispatch = useDispatch<AppDispatch>();
  const id: { id: string } = useParams();

  useEffect(() => {
    if (id !== null) {
      console.log(id.id);

      http.get<null, any>(`/diaries/entries/${id?.id}`).then((_entries) => {
        if (_entries) {
          const sortByLastUpdated = _entries.entries.sort((a: any, b: any) => {
            return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
          });

          dispatch(setEntries(sortByLastUpdated));
        }
      });
    }
  }, [id, dispatch]);

  return (
    <div>
      <header>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <h3>← Go Back</h3>
        </Link>
        <Box sx={{ margin: "0 auto" }}>
          {console.log(entries)}
          {entries.map((entry) => (
            <Box
              key={entry.id}
              onClick={() => {
                dispatch(setCurrentlyEditing(entry));
                dispatch(setCanEdit(true));
              }}
              sx={{
                boxShadow: "0px 0px 5px grey",
                padding: "10px",
                margin: "0 auto",
                marginBottom: "10px",
                width: "90%",
              }}
            >
              {entry.title}
            </Box>
          ))}
        </Box>
      </header>
    </div>
  );
};
