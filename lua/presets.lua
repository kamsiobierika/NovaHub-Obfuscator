return {
    ["Weak"] = {
        LuaVersion = "Lua51";
        Steps = {
            { Name = "EncryptStrings"; Settings = {} };
            { Name = "WrapInFunction"; Settings = {} };
        };
    };

    ["Medium"] = {
        LuaVersion = "Lua51";
        Steps = {          
            { Name = "EncryptStrings"; Settings = {} };
            { Name = "SplitStrings"; Settings = {} };
            { Name = "ProxifyLocals"; Settings = {} };
            { Name = "ConstantArray"; Settings = { Treshold = 1; StringsOnly = true; Shuffle = true; Rotate = true; LocalWrapperTreshold = 0 } };
            { Name = "WrapInFunction"; Settings = {} };
        };
    };

    ["Strong"] = {
        LuaVersion = "Lua51";
        Steps = {
            { Name = "EncryptStrings"; Settings = {} };
            { Name = "SplitStrings"; Settings = {} };
            { Name = "ProxifyLocals"; Settings = {} };
            { Name = "Vmify"; Settings = {} };
            { Name = "NumbersToExpressions"; Settings = {} };
            { Name = "ConstantArray"; Settings = { Treshold = 1; StringsOnly = true; Shuffle = true; Rotate = true; LocalWrapperTreshold = 0 } };
            { Name = "AddVararg"; Settings = {} };
            { Name = "WrapInFunction"; Settings = {} };
        };
    };
}
