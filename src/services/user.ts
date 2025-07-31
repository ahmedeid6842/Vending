import { UserModel } from '../models/user';

export const getUserService = async (queryObject: any, isCache = false) => {
  try {
    const user = await UserModel.findOne(queryObject).cache({
      useCache: isCache,
    });
    return user ? user : null;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createUserService = async (user: any) => {
  try {
    const savedUser = await UserModel.create(user);
    return savedUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const registerUserService = async (userData: any) => {
  try {
    // Check if username already exists
    const existingUser = await getUserService({ userName: userData.userName });
    if (existingUser) {
      return {
        success: false,
        statusCode: 400,
        error: {
          path: 'userName',
          message: `"userName":${userData.userName} already exist`,
        },
      };
    }

    // Create new user
    const newUser = await createUserService(userData);

    return {
      success: true,
      message: 'Register successfully',
      data: { user: newUser },
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      error: { message: error.message },
    };
  }
};

export const loginUserService = async (loginData: any) => {
  try {
    // Check if user exists
    const user = await getUserService({ userName: loginData.userName });
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        error: {
          path: 'email or password',
          message: 'Incorrect username or password',
        },
      };
    }

    // Verify password
    const isMatch = await user.comparePassword(loginData.password);
    if (!isMatch) {
      return {
        success: false,
        statusCode: 404,
        error: {
          path: 'email or password',
          message: 'Incorrect username or password',
        },
      };
    }

    return {
      success: true,
      message: 'Login successfully',
      data: { user },
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      error: { message: error.message },
    };
  }
};

export const updateUserWithValidationService = async (
  currentUsername: string,
  updateData: any
) => {
  try {
    // Check if new username is being used and if it's different from current
    if (updateData.userName && updateData.userName !== currentUsername) {
      const existingUser = await getUserService({
        userName: updateData.userName,
      });
      if (existingUser) {
        return {
          success: false,
          statusCode: 400,
          error: {
            path: 'userName',
            message: `"userName":${updateData.userName} already exist try one else`,
          },
        };
      }
    }

    // Update the user
    const updatedUser = await updateUserService(
      { userName: currentUsername },
      { $set: updateData }
    );

    if (!updatedUser) {
      return {
        success: false,
        statusCode: 404,
        error: { message: 'User not found' },
      };
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      error: { message: error.message },
    };
  }
};

export const updateUserService = async (
  queryObject: any,
  updateOperation: any
) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      queryObject,
      updateOperation,
      { new: true }
    );
    return updatedUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteUserService = async (queryObject: any) => {
  try {
    const deleteUser = await UserModel.findOneAndDelete(queryObject);
    return deleteUser ? true : false;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addOrderToUserService = async (userID: any, order: any) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { $push: { orders: order } },
      { new: true }
    );
    return updatedUser;
  } catch (error: any) {
    throw new Error(error);
  }
};
