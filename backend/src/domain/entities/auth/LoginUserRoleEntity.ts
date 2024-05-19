/**
 * LoginUserRole: ログインユーザー権限の中間テーブル
 *
 */
import {
  Entity,
  PrimaryColumn,
  // PrimaryGeneratedColumn,
  Column,
  //  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { LoginUserEntity } from '@/domain/entities/auth/LoginUserEntity'
import { RoleEntity } from '@/domain/entities/auth/RoleEntity'

@Entity('auth_login_user_roles')
export class LoginUserRoleEntity {
  constructor(data: { account: string; roleId: string; sortOrder: number; isDeleted: boolean }) {
    this.account = data ? data.account : ''
    this.roleId = data ? data.roleId : ''
    this.sortOrder = data ? data.sortOrder : 0
    this.isDeleted = data ? data.isDeleted : false
  }

  @PrimaryColumn({ length: 256 })
  public account: string = ''

  @PrimaryColumn({ length: 256 })
  public roleId: string = ''

  @Column({ unsigned: true, default: () => 0 })
  public sortOrder: number = 0

  @Column({ default: () => false })
  public isDeleted: boolean = false

  @CreateDateColumn({ nullable: true })
  public createdAt?: Date

  @UpdateDateColumn({ nullable: true })
  public updatedAt?: Date

  @Column({ nullable: true })
  public createdById?: string

  @Column({ nullable: true })
  public updatedById?: string

  // LoginUser エンティティとの ManyToOne 関係
  // eslint-disable-next-line @typescript-eslint/typedef
  @ManyToOne(() => LoginUserEntity, (loginUserEntity) => loginUserEntity.username, {
    createForeignKeyConstraints: false,
    persistence: false
  })
  @JoinColumn({
    name: 'account',
    referencedColumnName: 'account'
  })
  loginUserEntity?: LoginUserEntity

  // Role エンティティとの ManyToOne 関係
  // eslint-disable-next-line @typescript-eslint/typedef
  @OneToMany(() => RoleEntity, (roleEntity) => roleEntity.roleId, {
    createForeignKeyConstraints: false,
    persistence: false
  })
  roleEntity?: RoleEntity
}
