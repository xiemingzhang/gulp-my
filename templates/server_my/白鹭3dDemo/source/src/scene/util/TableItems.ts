/*************************************************************/
/**该文件由程序在[2016-12-19 15:40:26]自动生成!请勿手动修改!**/
/*************************************************************/

/**
*Equip表结构;
*/
interface EquipItem {
    /**
    *唯一编号;
    */
    id: number; 
    /**
    *名称;
    */
    name: string; 
    /**
    *描述;
    */
    desc: string; 
    /**
    *图标资源唯一编号;
    */
    icoId: number; 
    /**
    *攻击;
    */
    attack: number; 
    /**
    *防御;
    */
    defense: number; 
    /**
    *生命;
    */
    hp: number; 
    /**
    *法术;
    */
    mp: number; 
    /**
    *暴击;
    */
    crit: number; 
    /**
    *攻击速度;
    */
    attackSpeed: number; 
    /**
    *移动速度;
    */
    moveSpeed: number; 
}

/**
*Scene表结构;
*/
interface SceneItem {
    /**
    *唯一编号;
    */
    id: number; 
    /**
    *名称;
    */
    name: string; 
    /**
    *描述;
    */
    desc: string; 
    /**
    *资源编号;
    */
    asset_id: number; 
    /**
    *像机高度;
    */
    camera_height: number; 
    /**
    *像机旋转角度;
    *(x,y,z);
    */
    camera_rotate: string; 
    /**
    *可选角色单位编号;
    *（半角逗号隔开）;
    */
    role_list: string; 
    /**
    *最大玩家数;
    */
    max_player: number; 
    /**
    *最大波数;
    */
    max_wave: number; 
    /**
    *出怪批次唯一编号;
    */
    wave_id: number; 
    /**
    *第一波出怪等待时长;
    *（毫秒）;
    */
    start_wait: number; 
    /**
    *水晶塔单位编号;
    */
    host_unit_id: number; 
    /**
    *主机坐标点;
    */
    host_point: string; 
    /**
    *玩家出生点;
    */
    player_point: string; 
    /**
    *怪物出生点0;
    */
    monster_point_0: string; 
    /**
    *怪物出生点1;
    */
    monster_point_1: string; 
    /**
    *怪物出生点2;
    */
    monster_point_2: string; 
    /**
    *怪物出生点3;
    */
    monster_point_3: string; 
    /**
    *怪物出生点4;
    */
    monster_point_4: string; 
    /**
    *通关后下一个场景唯一编号;
    */
    next_scene_id: number; 
}

/**
*Skills表结构;
*/
interface SkillsItem {
    /**
    *唯一编号;
    */
    id: number; 
    /**
    *技能名称;
    */
    name: string; 
    /**
    *消耗法术;
    */
    mp: number; 
    /**
    *施法范围;
    */
    range: number; 
    /**
    *攻击范围;
    */
    attack_range: number; 
    /**
    *攻击类型;
    *(0：单体);
    *(1：群体);
    */
    attack_type: number; 
    /**
    *物理攻击;
    */
    attack_ad: number; 
    /**
    *法术攻击;
    */
    attack_ap: number; 
    /**
    *暴击;
    */
    crit: number; 
    /**
    *冷却时长;
    */
    cd_time: number; 
    /**
    *前摇;
    */
    start_time: number; 
    /**
    *定身;
    */
    lock_time: number; 
    /**
    *后摇;
    */
    end_time: number; 
    /**
    *总时长;
    */
    total_time: number; 
    /**
    *是否受攻速影响;
    */
    use_attack_speed: boolean; 
    /**
    *特效是否跟随;
    */
    is_follow: boolean; 
    /**
    *特效播放延迟;
    *（毫秒）;
    */
    effect_play_delay: string; 
    /**
    *播放速度;
    */
    speed: number; 
    /**
    *受击特效名称;
    */
    hit_effect_name: string; 
    /**
    *特效名称;
    */
    effect_play_name: string; 
    /**
    *动作名称;
    */
    animation_name: string; 
    /**
    *音效播放延迟;
    *（毫秒）;
    */
    sound_play_delay: string; 
    /**
    *触发音效;
    */
    sound_name: string; 
    /**
    *触发技能编号;
    */
    trigger_skills_id: number; 
}

/**
*Unit表结构;
*/
interface UnitItem {
    /**
    *唯一编号;
    */
    id: number; 
    /**
    *名称;
    */
    name: string; 
    /**
    *角色等级;
    */
    level: number; 
    /**
    *死亡经验;
    *(玩家吸收这个经验升级);
    */
    exp: number; 
    /**
    *升级表唯一编号;
    */
    upgrade_id: number; 
    /**
    *角色资源;
    */
    asset_id: string; 
    /**
    *缩放比;
    */
    scale_ratio: number; 
    /**
    *生命;
    */
    hp: number; 
    /**
    *法术;
    */
    mp: number; 
    /**
    *攻击;
    */
    attack: number; 
    /**
    *防御;
    */
    defense: number; 
    /**
    *暴击;
    */
    crit: number; 
    /**
    *暴击伤害;
    */
    critDamage: number; 
    /**
    *攻击速度;
    */
    attack_speed: number; 
    /**
    *攻击范围;
    *(进入该范围会主动攻击);
    */
    attack_range: number; 
    /**
    *移动速度;
    */
    moveSpeed: number; 
    /**
    *主属性;
    */
    primettribute: string; 
    /**
    *基础力量;
    */
    strength: number; 
    /**
    *基础敏捷;
    */
    agility: number; 
    /**
    *基础智力;
    */
    intelligence: number; 
    /**
    *技能0;
    *（普攻）;
    */
    skill_0_id: number; 
    /**
    *技能1;
    */
    skill_1_id: number; 
    /**
    *技能2;
    */
    skill_2_id: number; 
    /**
    *技能3;
    */
    skill_3_id: number; 
    /**
    *技能4;
    */
    skill_4_id: number; 
    /**
    *受击特效骨骼名称;
    */
    hit_effect_bone: string; 
    /**
    *受击音效;
    */
    hit_sound: string; 
    /**
    *死亡音效;
    */
    death_sound: string; 
}

/**
*Upgrade表结构;
*/
interface UpgradeItem {
    /**
    *唯一编号;
    */
    id: number; 
    /**
    *描述;
    */
    desc: string; 
    /**
    *升级经验;
    */
    upgrade_exp: number; 
    /**
    *下一级唯一编号;
    */
    next_id: number; 
    /**
    *生命;
    */
    hp: number; 
    /**
    *法术;
    */
    mp: number; 
    /**
    *攻击;
    */
    attack: number; 
    /**
    *防御;
    */
    defense: number; 
    /**
    *暴击;
    */
    crit: number; 
    /**
    *暴击伤害;
    */
    critDamage: number; 
    /**
    *攻击速度;
    */
    attack_speed: number; 
    /**
    *移动速度;
    */
    moveSpeed: number; 
    /**
    *基础力量;
    */
    strength: number; 
    /**
    *基础敏捷;
    */
    agility: number; 
    /**
    *基础智力;
    */
    intelligence: number; 
}

/**
*Wave表结构;
*/
interface WaveItem {
    /**
    *唯一编号;
    */
    id: number; 
    /**
    *怪物A唯一编号;
    */
    monsterA_id: number; 
    /**
    *怪物A数量;
    */
    monsterA_num: number; 
    /**
    *怪物B唯一编号;
    */
    monsterB_id: number; 
    /**
    *怪物B数量;
    */
    monsterB_num: number; 
    /**
    *怪物C唯一编号;
    */
    monsterC_id: number; 
    /**
    *怪物C数量;
    */
    monsterC_num: number; 
    /**
    *怪物D唯一编号;
    */
    monsterD_id: number; 
    /**
    *怪物D数量;
    */
    monsterD_num: number; 
    /**
    *怪物E唯一编号;
    */
    monsterE_id: number; 
    /**
    *怪物E数量;
    */
    monsterE_num: number; 
    /**
    *怪物E出生点编号;
    */
    monsterE_point: number; 
    /**
    *下一波唯一编号;
    */
    next_wave: number; 
}

