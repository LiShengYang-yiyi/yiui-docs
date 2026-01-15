# 公共组件Common

# 公共组件Common

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 定义 
 如:有一个货币组件   在主界面也会显示这个货币组件    在其他界面比如 商店 也会显示这个货币组件 
 这种通用 会被复用的组件 统称为公共组件 
 
 创建 
 不管你是要动态创建一个公共组件 还是 这个公共组件提前放到某个组件内 
 都需要先有这个公共组件的声明 要先有这么个类(预制体) 
 
 手动创建 
 跟平时一样 通用的预制体相同  只需要在根节点挂载 CDE 脚本 则这个预制体就是YIUI公共组件 
 自动创建 
 任意节点下 右键创建 Common 
 
![Image](/images/GC3qwVOmtis6dlkpuWCco4MznAf_1_c2760b95.png)
 修改创建的obj 名称  建议: XX Item, XX Common, XX Cell 
 然后拖入到对应文件夹 创建成为预制体 
 😊 公共节点使用view也是可以的  不过公共的view 无法自动触发open 生命周期 
 所以建议 公共组件 使用 Common 
 总结要求 
 😊 1: 是一个预制体 
 2: 名称不能是 XX Panel   (XX View 是可以的 但是无法自动触发Open生命周期) 
 3: 然后这个预制体的根节点有 CDE脚本  自动生成即可 
 
 view的open生命周期是由Panel自动调用的 
 当然你如果使用一个公共界面用View做想调用Open生命周期也是可以的 
 需要手动调用 参考panel中的自己发送消息就可以了 
 这里只是说明一下可以调用到 万一你的这个view在某个panel中还想公共呢 
 也不是不可以做到   不了解的情况下还是不建议搞这么复杂 
 
 生成 
 创建完毕后 对应的公共组件点击生成   生成对应的类(脚本) 
 
 静态公共组件 
 关联 
 举例: 
 有个名为BattleSkillItem的公共组件 
 
![Image](/images/GC3qwVOmtis6dlkpuWCco4MznAf_2_8ec11c16.png)
 拖入到目标预制体下 
 比如当前这个预制体是 BattleUnitInfoItem  又关联了这个BattleSkillItem