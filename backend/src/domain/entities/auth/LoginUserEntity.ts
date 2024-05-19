/**
 * LoginUser: ログインユーザー
 *
 */
import {
  Entity,
  PrimaryColumn,
  // PrimaryGeneratedColumn,
  Column,
  // DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // OneToOne,
  // ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { LoginUserRoleEntity } from '@/domain/entities/auth/LoginUserRoleEntity'

@Entity('auth_login_users')
export class LoginUserEntity {
  constructor(data: {
    account: string
    username: string
    password: string
    enabled: boolean
    accountNonExpired: boolean
    accountNonLocked: boolean
    credentialsNonExpired: boolean
    sortOrder: number
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
    loginUserRoleEntities: LoginUserRoleEntity[]
  }) {
    this.account = data ? data.account : ''
    this.username = data ? data.username : ''
    this.password = data ? data.password : ''
    this.enabled = data ? data.enabled : false
    this.accountNonExpired = data ? data.accountNonExpired : true
    this.accountNonLocked = data ? data.accountNonLocked : true
    this.credentialsNonExpired = data ? data.credentialsNonExpired : true
    this.sortOrder = data ? data.sortOrder : 0
    this.isDeleted = data ? data.isDeleted : false

    this.loginUserRoleEntities = data ? data.loginUserRoleEntities : []
  }

  @PrimaryColumn({ length: 256 })
  public account: string = ''

  @Column({ length: 256 })
  public username: string = ''

  @Column({ length: 256 })
  public password: string = ''

  // アカウントが有効かどうかを示すフラグ
  @Column()
  public enabled: boolean = false

  // アカウントの有効期限が切れているかどうかを示すフラグ
  @Column()
  public accountNonExpired: boolean = false

  // 資格情報の有効期限が切れているかどうかを示すフラグ
  @Column()
  public accountNonLocked: boolean = false

  // アカウントがロックされているかどうかを示すフラグ
  @Column()
  public credentialsNonExpired: boolean = false

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

  // ユーザーが持つ権限のリスト
  // eslint-disable-next-line @typescript-eslint/typedef
  @OneToMany(() => LoginUserRoleEntity, (loginUserRoleEntity) => loginUserRoleEntity.loginUserEntity, {
    createForeignKeyConstraints: false,
    persistence: false
    // cascade: true,
    // eager: true,
    // onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'account',
    referencedColumnName: 'account'
  })
  public loginUserRoleEntities: LoginUserRoleEntity[]
}
