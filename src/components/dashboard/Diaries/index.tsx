import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Box, Button, Flex, Text } from "theme-ui";
import { setUser } from "../../../features/auth/userSlice";
import { addDiary } from "../../../features/diary/diariesSlice";
import { Diary } from "../../../interfaces/diary.interface";
import { User } from "../../../interfaces/user.interface";
import { RootState } from "../../../redux/rootReducer";
import { AppDispatch } from "../../../redux/store";
import http from "../../../services/mirage/api";

export const Diaries = () => {
  const user = useSelector((state: RootState) => state.user.user);
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
      <Button sx={{ borderRadius: "7px" }} onClick={createNewDiary}>
        CREATE NEW
      </Button>

      {/* part of diary tile */}
      <Box sx={{ margin: "0px 10px" }}>
        <Text>My First Diary</Text>
        <Text>1 saved entries</Text>
        <Flex>
          <Button sx={{ borderRadius: "7px" }}>ADD NEW ENTRY</Button>
          <Button sx={{ marginLeft: "5px", borderRadius: "7px" }}>
            VIEW ALL
          </Button>
        </Flex>
      </Box>
      <Box>
        <Text>My Second Diary</Text>
        <Text>1 saved entries</Text>
        <Flex>
          <Button>ADD NEW ENTRY</Button>
          <Button>VIEW ALL</Button>
        </Flex>
      </Box>
    </div>
  );
};
