import reactAvatar from '@/assets/account.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface UserInfo {
    avatar: string;
    name: string;
    email: string;
    password: string;
    github: string;
    introduction: string;
}

interface PasswordInfo {
    oldPassword: string;
    newPassword: string;
    newPasswordAgain: string;
    bool: boolean;
    warn: string;
}

const AccountInformation = () => {
    const initialUserInformation: UserInfo = {
        avatar: reactAvatar,
        name: 'Christine',
        email: '2977797064@qq.com',
        password: '123456',
        github: 'https://github.com/',
        introduction: '',
    };

    const [infoChange, setInfoChange] = useState<UserInfo>(initialUserInformation);
    const [passwordChange, setPasswordChange] = useState<PasswordInfo>({
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: '',
        bool: false,
        warn: '',
    });

    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            const url = URL.createObjectURL(selectedFile);
            setSelectedImageUrl(url);
            console.log('选中的文件:', url);
        }
    };

    useEffect(() => {
        const validatePassword = () => {
            if (passwordChange.oldPassword === ''){
                return { bool: false, warn: '' };
            }
            else if (passwordChange.oldPassword !== initialUserInformation.password) {
                return { bool: false, warn: '旧密码错误' };
            } else if (passwordChange.newPassword !== passwordChange.newPasswordAgain) {
                return { bool: false, warn: '两次密码不一致' };
            } else {
                return { bool: true, warn: '' };
            }
        };

        const { bool, warn } = validatePassword();
        setPasswordChange((prev) => ({
            ...prev,
            bool,
            warn,
        }));
    }, [passwordChange.oldPassword, passwordChange.newPassword, passwordChange.newPasswordAgain, initialUserInformation.password]);

    return (
        <div>
            <Avatar className={`relative size-30 m-5`}>
                <AvatarImage src={selectedImageUrl || reactAvatar} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
                    <Label htmlFor="picture">更改头像</Label>
                    <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
                    <Label htmlFor="name">更改昵称</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="请输入昵称"
                        value={infoChange.name}
                        onChange={(e) =>
                            setInfoChange({
                                ...infoChange,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
                    <Label htmlFor="email">更改邮箱</Label>
                    <Input
                        type="email"
                        id="email"
                        placeholder="请输入邮箱"
                        value={infoChange.email}
                        onChange={(e) =>
                            setInfoChange({
                                ...infoChange,
                                email: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
                    <Label htmlFor="password">
                        更改密码 <span className={`text-red-700`}>{passwordChange.warn}</span>
                    </Label>
                    <Input
                        className={`mb-3`}
                        type="password"
                        id="oldPassword"
                        placeholder="请输入旧密码"
                        value={passwordChange.oldPassword}
                        onChange={(e) =>
                            setPasswordChange({
                                ...passwordChange,
                                oldPassword: e.target.value,
                            })
                        }
                    />
                    <Input
                        className={`mb-3`}
                        type="password"
                        id="newPassword"
                        placeholder="请输入新密码"
                        value={passwordChange.newPassword}
                        onChange={(e) =>
                            setPasswordChange({
                                ...passwordChange,
                                newPassword: e.target.value,
                            })
                        }
                    />
                    <Input
                        type="password"
                        id="newPasswordAgain"
                        placeholder="请再次输入新密码"
                        value={passwordChange.newPasswordAgain}
                        onChange={(e) =>
                            setPasswordChange({
                                ...passwordChange,
                                newPasswordAgain: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
                    <Label htmlFor="github">GitHub链接</Label>
                    <Input
                        type="text"
                        id="github"
                        placeholder="请输入GitHub链接"
                        value={infoChange.github}
                        onChange={(e)=>{
                            setInfoChange({
                                ...infoChange,
                                github: e.target.value,
                            })
                        }}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
                    <Label htmlFor="biography">个人简介网址</Label>
                    <Input
                        type="text"
                        id="biography"
                        placeholder="请输入人简介网址"
                        value={infoChange.introduction}
                        onChange={(e)=>{
                            setInfoChange({
                                ...infoChange,
                                introduction: e.target.value,
                            })
                        }}/>
                </div>
            </div>
            <Button className={`ml-5 cursor-pointer`}>保存更改</Button>
        </div>
    );
};

export default AccountInformation;