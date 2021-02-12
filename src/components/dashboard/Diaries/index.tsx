import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Swal from "sweetalert2";
import { Box, Button, Flex, Text } from "theme-ui";
import { setUser } from "../../../features/auth/userSlice";
import { addDiary } from "../../../features/diary/diariesSlice";
import { Diary } from "../../../interfaces/diary.interface";
import { User } from "../../../interfaces/user.interface";
import { RootState } from "../../../redux/rootReducer";
import { AppDispatch } from "../../../redux/store";
import http from "../../../services/mirage/api";
import { DiaryEntriesList } from "./DiaryEntriesList";
import { DiaryTile } from "./DiaryTile";

export const Diaries = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const diaries = useSelector((state: RootState) => state.diaries);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<null, Diary[]>(`/diaries/${user.id}`).then((data) => {
          if (data && data.length > 0) {
            const sortedByUpdatedAt = data.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(addDiary(sortedByUpdatedAt));
          }
        });
      }
    };
    fetchDiaries();
  }, [user, dispatch]);

  const createNewDiary = async () => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Next →",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        titleText: "Diary title",
        input: "text",
      },
      {
        titleText: "Private or public diary?",
        input: "radio",
        inputOptions: {
          private: "Private",
          public: "Public",
        },
        inputValue: "private",
      },
    ]);

    if (result.value) {
      const { value } = result;
      const { diary, user: _user } = await http.post<
        Partial<Diary>,
        { user: User; diary: Diary }
      >("/diaries/", {
        title: value[0],
        type: value[1],
        userId: user?.id,
      });

      if (diary && _user) {
        dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));
        return Swal.fire({
          titleText: "All done!",
          confirmButtonText: "OK!",
        });
      }
      Swal.fire({
        titleText: "Cancelled",
      });
    }
  };
  return (
    <div style={{ width: "400px" }}>
      {/* part of diary tile */}
      <Switch>
        <Route path="/diary/:id">
          <DiaryEntriesList />
        </Route>
        <Route path="/">
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={createNewDiary}
              sx={{
                borderRadius: "7px",
                width: "90%",
                boxShadow: "0px 0px 8px grey",
              }}
            >
              Create New
            </Button>
          </div>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            {diaries.map((diary, idx) => (
              <DiaryTile key={idx} diary={diary} />
            ))}
          </Box>
        </Route>
      </Switch>
    </div>
  );
};
